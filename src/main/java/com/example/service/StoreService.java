package com.example.service;

import com.example.model.dto.StoreDto;

import java.util.List;

public interface StoreService {
    List<StoreDto> findAll();
    StoreDto findById(Long id);
    StoreDto create(StoreDto storeDto);
    void delete(Long id);
    StoreDto update(Long id, StoreDto update);
}
