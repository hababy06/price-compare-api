package com.example.service.impl;

import com.example.model.dto.*;
import com.example.model.entity.Role;
import com.example.model.entity.User;
import com.example.repository.RoleRepository;
import com.example.repository.UserRepository;
import com.example.service.UserService;
import com.example.service.EmailService;
import com.example.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;

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
        // 修正這邊 ↓
        if (!user.isEmailVerified()) {
            throw new RuntimeException("Email 尚未驗證，請先完成信箱驗證！");
        }
        String token = jwtUtil.generateToken(user.getUsername());
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