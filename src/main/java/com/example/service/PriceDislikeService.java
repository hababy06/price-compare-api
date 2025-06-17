package com.example.service;

public interface PriceDislikeService {
    boolean dislikePrice(Long priceId, Long userId);
    boolean undislikePrice(Long priceId, Long userId);
    long getDislikeCount(Long priceId);
    boolean hasDisliked(Long priceId, Long userId);
} 