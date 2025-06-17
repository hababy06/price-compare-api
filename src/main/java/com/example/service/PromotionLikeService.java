package com.example.service;

public interface PromotionLikeService {
    boolean like(Long userId, Long promotionId);
    boolean unlike(Long userId, Long promotionId);
    boolean hasLiked(Long userId, Long promotionId);
    int countLikes(Long promotionId);
} 