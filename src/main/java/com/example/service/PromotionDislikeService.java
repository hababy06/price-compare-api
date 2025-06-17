package com.example.service;

public interface PromotionDislikeService {
    boolean dislikePromotion(Long promotionId, Long userId);
    boolean undislikePromotion(Long promotionId, Long userId);
    long getDislikeCount(Long promotionId);
    boolean hasDisliked(Long promotionId, Long userId);
} 