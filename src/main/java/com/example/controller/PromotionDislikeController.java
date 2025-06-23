package com.example.controller;

import com.example.model.entity.User;
import com.example.repository.UserRepository;
import com.example.service.PromotionDislikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/promotion-dislikes")
public class PromotionDislikeController {

    @Autowired
    private PromotionDislikeService promotionDislikeService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{promotionId}/dislike")
    public ResponseEntity<?> dislikePromotion(@PathVariable Long promotionId, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Long userId = user.getId();
        boolean disliked = promotionDislikeService.dislikePromotion(promotionId, userId);
        return ResponseEntity.ok(Map.of("disliked", disliked));
    }

    @DeleteMapping("/{promotionId}")
    public ResponseEntity<?> undislikePromotion(@PathVariable Long promotionId, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Long userId = user.getId();
        boolean undisliked = promotionDislikeService.undislikePromotion(promotionId, userId);
        Map<String, Object> response = new HashMap<>();
        response.put("undisliked", undisliked);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{promotionId}/undislike")
    public ResponseEntity<?> undislikePromotionPost(@PathVariable Long promotionId, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Long userId = user.getId();
        boolean undisliked = promotionDislikeService.undislikePromotion(promotionId, userId);
        Map<String, Object> response = new HashMap<>();
        response.put("undisliked", undisliked);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{promotionId}/count")
    public ResponseEntity<?> getDislikeCount(@PathVariable Long promotionId) {
        long count = promotionDislikeService.getDislikeCount(promotionId);
        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{promotionId}/has-disliked")
    public ResponseEntity<?> hasDisliked(@PathVariable Long promotionId, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Long userId = user.getId();
        boolean hasDisliked = promotionDislikeService.hasDisliked(promotionId, userId);
        Map<String, Object> response = new HashMap<>();
        response.put("hasDisliked", hasDisliked);
        return ResponseEntity.ok(response);
    }
} 