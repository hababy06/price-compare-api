package com.example.model.dto;
import lombok.Data;

@Data
public class UserLoginDTO {
    private String username; // or email
    private String password;
}