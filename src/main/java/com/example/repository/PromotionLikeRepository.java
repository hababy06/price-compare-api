package com.example.repository;

import com.example.model.entity.PromotionLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PromotionLikeRepository extends JpaRepository<PromotionLike, Long> {
    Optional<PromotionLike> findByUserIdAndPromotionId(Long userId, Long promotionId);
    int countByPromotionId(Long promotionId);
    void deleteByUserIdAndPromotionId(Long userId, Long promotionId);
    Optional<PromotionLike> findByUniqueKey(String uniqueKey);
} 