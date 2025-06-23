package com.example.service;

import com.example.model.dto.PriceInfoDto;

import java.util.List;

public interface PriceInfoService {
    List<PriceInfoDto> findAll();
    List<PriceInfoDto> findByProductAndStore(Long productId, Long storeId);
    PriceInfoDto create(PriceInfoDto dto);
	List<PriceInfoDto> findByProduct(Long productId);
	List<PriceInfoDto> findByProductOrderByPrice(Long productId);
}
