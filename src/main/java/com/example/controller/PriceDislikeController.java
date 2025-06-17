package com.example.controller;

import com.example.model.entity.User;
import com.example.repository.UserRepository;
import com.example.service.PriceDislikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/price-dislikes")
public class PriceDislikeController {

    @Autowired
    private PriceDislikeService priceDislikeService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{priceId}")
    public ResponseEntity<?> dislikePrice(@PathVariable Long priceId, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Long userId = user.getId();
        boolean disliked = priceDislikeService.dislikePrice(priceId, userId);
        return ResponseEntity.ok(Map.of("disliked", disliked));
    }

    @PostMapping("/{priceId}/undislike")
    public ResponseEntity<?> undislikePrice(@PathVariable Long priceId, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Long userId = user.getId();
        boolean undisliked = priceDislikeService.undislikePrice(priceId, userId);
        return ResponseEntity.ok(Map.of("undisliked", undisliked));
    }

    @GetMapping("/{priceId}/count")
    public ResponseEntity<?> getDislikeCount(@PathVariable Long priceId) {
        long count = priceDislikeService.getDislikeCount(priceId);
        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{priceId}/has-disliked")
    public ResponseEntity<?> hasDisliked(@PathVariable Long priceId, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Long userId = user.getId();
        boolean hasDisliked = priceDislikeService.hasDisliked(priceId, userId);
        Map<String, Object> response = new HashMap<>();
        response.put("hasDisliked", hasDisliked);
        return ResponseEntity.ok(response);
    }
} 