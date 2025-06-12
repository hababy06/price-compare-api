package com.example.controller;

import com.example.model.dto.*;
import com.example.model.entity.User;
import com.example.repository.UserRepository;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public UserProfileDTO register(@RequestBody UserRegisterDTO dto) {
        return userService.register(dto);
    }

    @PostMapping("/login")
    public TokenResponse login(@RequestBody UserLoginDTO dto) {
        return userService.login(dto);
    }

    // 新增：Email 驗證 API，讓使用者點擊信件連結時使用
    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
        Optional<User> userOpt = userRepository.findByEmailVerifyToken(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setEmailVerified(true);
            user.setEmailVerifyToken(null);
            userRepository.save(user);
            return ResponseEntity.ok("驗證成功，請返回登入畫面！");
        }
        return ResponseEntity.badRequest().body("驗證失敗或連結已過期。");
    }
}