package com.example.service;

import com.example.model.dto.*;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpServletRequest;

public interface UserService {
    UserProfileDTO register(UserRegisterDTO dto);
    TokenResponse login(UserLoginDTO dto);
    UserProfileDTO getProfile(String username);
    UserProfileDTO updateProfile(String username, UserProfileDTO dto);
    
    // 新增登出功能
    ResponseEntity<?> logout(HttpServletRequest request);
    
    // 新增密碼重置功能
    ResponseEntity<?> forgotPassword(ForgotPasswordDTO dto);
    ResponseEntity<?> resetPassword(ResetPasswordDTO dto);
    // 其他用戶相關業務方法可自行擴充
}