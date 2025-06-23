package com.example.repository;

import com.example.model.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    List<Promotion> findByProductIdAndStoreId(Long productId, Long storeId);
    List<Promotion> findByProductIdOrderByReportCountDescFinalPriceAsc(Long productId);
    List<Promotion> findByProductIdOrderByFinalPriceAscReportCountDesc(Long productId);

}
