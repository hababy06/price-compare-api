package com.example.service;

public interface EmailService {
    void send(String to, String subject, String content);
}