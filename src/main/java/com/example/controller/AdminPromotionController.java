package com.example.controller;

import com.example.repository.PromotionRepository;
import com.example.repository.PromotionLikeRepository;
import com.example.repository.PromotionDislikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/promotions")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPromotionController {
    @Autowired
    private PromotionRepository promotionRepository;
    @Autowired
    private PromotionLikeRepository promotionLikeRepository;
    @Autowired
    private PromotionDislikeRepository promotionDislikeRepository;

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePromotion(@PathVariable Long id) {
        if (!promotionRepository.existsById(id)) return ResponseEntity.notFound().build();
        // 先刪除所有 like/dislike
        promotionLikeRepository.deleteAll(
            promotionLikeRepository.findAll().stream().filter(like -> like.getPromotion().getId().equals(id)).toList()
        );
        promotionDislikeRepository.deleteAll(
            promotionDislikeRepository.findAll().stream().filter(dislike -> dislike.getPromotion().getId().equals(id)).toList()
        );
        promotionRepository.deleteById(id);
        return ResponseEntity.ok("優惠已刪除");
    }
} 