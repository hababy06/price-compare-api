package com.example.service.impl;

import com.example.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void send(String to, String subject, String content) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(content);
        mailSender.send(msg);
    }

    @Override
    public void sendVerificationEmail(String to, String token) {
        String subject = "驗證您的電子郵件";
        String content = "請點擊以下連結驗證您的電子郵件：\n" +
                "http://localhost:8080/api/auth/verify-email?token=" + token;
        send(to, subject, content);
    }

    @Override
    public void sendPasswordResetEmail(String to, String resetLink) {
        String subject = "重置您的密碼";
        String content = "請點擊以下連結重置您的密碼：\n" + resetLink;
        send(to, subject, content);
    }
}