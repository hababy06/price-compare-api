package com.example.repository;

import com.example.model.entity.PriceLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PriceLikeRepository extends JpaRepository<PriceLike, Long> {
    Optional<PriceLike> findByUniqueKey(String uniqueKey);
    long countByPriceInfoId(Long priceInfoId);
} 