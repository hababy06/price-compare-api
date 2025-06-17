package com.example.service;

public interface PriceLikeService {
    boolean likePrice(Long priceId, Long userId);
    boolean unlikePrice(Long priceId, Long userId);
    long getLikeCount(Long priceId);
    boolean hasLiked(Long priceId, Long userId);
} 