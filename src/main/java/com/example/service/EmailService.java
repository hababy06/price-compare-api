package com.example.service;

public interface EmailService {
    void send(String to, String subject, String content);
    void sendVerificationEmail(String to, String token);
    void sendPasswordResetEmail(String to, String resetLink);
}