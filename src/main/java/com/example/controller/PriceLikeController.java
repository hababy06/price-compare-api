package com.example.controller;

import com.example.model.entity.User;
import com.example.repository.UserRepository;
import com.example.service.PriceLikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/price-likes")
public class PriceLikeController {

    @Autowired
    private PriceLikeService priceLikeService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{priceId}/like")
    public ResponseEntity<?> likePrice(@PathVariable Long priceId, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Long userId = user.getId();
        boolean liked = priceLikeService.likePrice(priceId, userId);
        return ResponseEntity.ok(Map.of("liked", liked));
    }

    @PostMapping("/{priceId}/unlike")
    public ResponseEntity<?> unlikePrice(@PathVariable Long priceId, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Long userId = user.getId();
        boolean unliked = priceLikeService.unlikePrice(priceId, userId);
        Map<String, Object> response = new HashMap<>();
        response.put("unliked", unliked);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{priceId}/count")
    public ResponseEntity<?> getLikeCount(@PathVariable Long priceId) {
        long count = priceLikeService.getLikeCount(priceId);
        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{priceId}/has-liked")
    public ResponseEntity<?> hasLiked(@PathVariable Long priceId, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Long userId = user.getId();
        boolean hasLiked = priceLikeService.hasLiked(priceId, userId);
        Map<String, Object> response = new HashMap<>();
        response.put("hasLiked", hasLiked);
        return ResponseEntity.ok(response);
    }
} 