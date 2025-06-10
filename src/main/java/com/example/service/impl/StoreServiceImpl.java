package com.example.service.impl;

import com.example.model.dto.StoreDto;
import com.example.model.entity.Store;
import com.example.repository.StoreRepository;
import com.example.service.StoreService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StoreServiceImpl implements StoreService {

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<StoreDto> findAll() {
        return storeRepository.findAll().stream()
                .map(store -> modelMapper.map(store, StoreDto.class))
                .toList();
    }

    @Override
    public StoreDto findById(Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("找不到商店"));
        return modelMapper.map(store, StoreDto.class);
    }

    @Override
    public StoreDto create(StoreDto storeDto) {
        Store store = modelMapper.map(storeDto, Store.class);
        return modelMapper.map(storeRepository.save(store), StoreDto.class);
    }

    @Override
    public void delete(Long id) {
        storeRepository.deleteById(id);
    }
}
