package com.example.service.impl;

import com.example.model.dto.*;
import com.example.model.entity.Role;
import com.example.model.entity.User;
import com.example.repository.RoleRepository;
import com.example.repository.UserRepository;
import com.example.service.UserService;
import com.example.service.EmailService;
import com.example.util.JwtUtil;
import com.example.exception.AccountLockedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private EmailService emailService;

    private Map<String, Integer> loginAttempts = new ConcurrentHashMap<>();
    private static final int MAX_ATTEMPTS = 5;

    // 用於存儲登出後的 token
    private static final ConcurrentHashMap<String, Long> tokenBlacklist = new ConcurrentHashMap<>();
    
    // 用於存儲密碼重置 token
    private static final ConcurrentHashMap<String, Long> resetTokens = new ConcurrentHashMap<>();

    @Override
    public UserProfileDTO register(UserRegisterDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username taken");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email taken");
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setNickname(dto.getNickname());
        user.setCreatedAt(LocalDateTime.now());
        user.setStatus(User.Status.ACTIVE);

        // Email 驗證欄位
        user.setEmailVerified(false);
        String verifyToken = UUID.randomUUID().toString();
        user.setEmailVerifyToken(verifyToken);

        // 預設 USER 角色
        Role userRole = roleRepository.findByName("USER")
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setName("USER");
                    return roleRepository.save(r);
                });
        user.setRoles(Collections.singleton(userRole));
        user = userRepository.save(user);

        // 發送驗證信
        String verifyLink = "http://localhost:8080/api/auth/verify-email?token=" + verifyToken;
        String emailContent = "親愛的用戶您好，請點擊下方連結驗證您的信箱：\n" + verifyLink;
        emailService.send(user.getEmail(), "會員信箱驗證", emailContent);

        return toProfileDTO(user);
    }

    @Override
    public TokenResponse login(UserLoginDTO dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Password error");
        }
        if (!user.isEmailVerified()) {
            throw new RuntimeException("Email 尚未驗證，請先完成信箱驗證！");
        }
        if (loginAttempts.getOrDefault(dto.getUsername(), 0) >= MAX_ATTEMPTS) {
            throw new AccountLockedException("帳號已被鎖定，請稍後再試");
        }
        String token = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            user.getRoles().stream()
                .map(role -> new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + role.getName()))
                .collect(java.util.stream.Collectors.toList())
        ));
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        return new TokenResponse(token);
    }

    @Override
    public UserProfileDTO getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toProfileDTO(user);
    }

    @Override
    public UserProfileDTO updateProfile(String username, UserProfileDTO dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (dto.getNickname() != null) user.setNickname(dto.getNickname());
        userRepository.save(user);
        return toProfileDTO(user);
    }

    @Override
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        // 將 token 加入黑名單，設置 24 小時過期
        tokenBlacklist.put(token, System.currentTimeMillis() + 86400000);
        return ResponseEntity.ok().body("登出成功");
    }

    @Override
    public ResponseEntity<?> forgotPassword(ForgotPasswordDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
            .orElseThrow(() -> new RuntimeException("找不到該 email 的用戶"));
            
        // 生成重置密碼的 token
        String resetToken = UUID.randomUUID().toString();
        resetTokens.put(resetToken, System.currentTimeMillis() + 3600000); // 1小時過期
        
        // 發送重置密碼郵件
        String resetLink = "http://your-frontend-url/reset-password?token=" + resetToken;
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        
        return ResponseEntity.ok().body("密碼重置郵件已發送");
    }

    @Override
    public ResponseEntity<?> resetPassword(ResetPasswordDTO dto) {
        // 驗證 token
        if (!resetTokens.containsKey(dto.getToken())) {
            return ResponseEntity.badRequest().body("無效或過期的重置密碼連結");
        }
        
        // 驗證密碼
        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("兩次輸入的密碼不一致");
        }
        
        // 更新密碼
        User user = userRepository.findByResetToken(dto.getToken())
            .orElseThrow(() -> new RuntimeException("找不到對應的用戶"));
            
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        user.setResetToken(null);
        userRepository.save(user);
        
        // 移除已使用的 token
        resetTokens.remove(dto.getToken());
        
        return ResponseEntity.ok().body("密碼重置成功");
    }

    private UserProfileDTO toProfileDTO(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setNickname(user.getNickname());
        dto.setStatus(user.getStatus().name());
        dto.setCreatedAt(user.getCreatedAt()!=null ? user.getCreatedAt().toString() : null);
        dto.setLastLogin(user.getLastLogin()!=null ? user.getLastLogin().toString() : null);
        return dto;
    }
}