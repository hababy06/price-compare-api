package com.example.service;

import com.example.model.dto.UserProfileDTO;
import com.example.model.dto.UserRegisterDTO;
import com.example.model.dto.UserLoginDTO;
import com.example.model.dto.TokenResponse;

public interface UserService {
    UserProfileDTO register(UserRegisterDTO dto);
    TokenResponse login(UserLoginDTO dto);
    UserProfileDTO getProfile(String username);
    UserProfileDTO updateProfile(String username, UserProfileDTO dto);
    // 其他用戶相關業務方法可自行擴充
}