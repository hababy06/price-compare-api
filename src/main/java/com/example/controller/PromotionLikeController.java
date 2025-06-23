package com.example.controller;

import com.example.service.PromotionLikeService;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/promotion-likes")
public class PromotionLikeController {
    @Autowired
    private PromotionLikeService likeService;
    @Autowired
    private UserRepository userRepository;

    private Long getUserId(Principal principal) {
        // 這裡假設 principal.getName() 是 username
        return userRepository.findByUsername(principal.getName()).orElseThrow().getId();
    }

    @PostMapping("/{promotionId}/like")
    public Map<String, Object> like(@PathVariable Long promotionId, Principal principal) {
        Long userId = getUserId(principal);
        boolean result = likeService.like(userId, promotionId);
        return Map.of("liked", result);
    }

    @PostMapping("/{promotionId}/unlike")
    public Map<String, Object> unlike(@PathVariable Long promotionId, Principal principal) {
        Long userId = getUserId(principal);
        boolean result = likeService.unlike(userId, promotionId);
        return Map.of("unliked", result);
    }

    @GetMapping("/{promotionId}/has-liked")
    public Map<String, Object> hasLiked(@PathVariable Long promotionId, Principal principal) {
        Long userId = getUserId(principal);
        boolean result = likeService.hasLiked(userId, promotionId);
        return Map.of("hasLiked", result);
    }

    @GetMapping("/{promotionId}/count")
    public Map<String, Object> count(@PathVariable Long promotionId) {
        int count = likeService.countLikes(promotionId);
        return Map.of("count", count);
    }
} 