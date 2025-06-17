package com.example.repository;

import com.example.model.entity.PriceDislike;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
 
public interface PriceDislikeRepository extends JpaRepository<PriceDislike, Long> {
    Optional<PriceDislike> findByUniqueKey(String uniqueKey);
    long countByPriceInfoId(Long priceInfoId);
} 