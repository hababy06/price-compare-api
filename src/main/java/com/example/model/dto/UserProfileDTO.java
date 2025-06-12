package com.example.model.dto;

import lombok.Data;

@Data
public class UserProfileDTO {
    private Long id;
    private String username;
    private String email;
    private String nickname;
    private String status;
    private String createdAt;
    private String lastLogin;
}