package com.example.repository;

import com.example.model.entity.PromotionDislike;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
 
public interface PromotionDislikeRepository extends JpaRepository<PromotionDislike, Long> {
    Optional<PromotionDislike> findByUniqueKey(String uniqueKey);
    long countByPromotionId(Long promotionId);
} 