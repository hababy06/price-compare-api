package com.example.service;

import com.example.model.dto.PromotionDto;

import java.util.List;

public interface PromotionService {
    List<PromotionDto> findAll();
    List<PromotionDto> findByProductAndStore(Long productId, Long storeId);
    PromotionDto create(PromotionDto dto);
    List<PromotionDto> findByProduct(Long productId);
}
