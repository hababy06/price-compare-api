package com.example.controller;

import com.example.model.dto.StoreDto;
import com.example.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/stores")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStoreController {
    @Autowired
    private StoreService storeService;

    @GetMapping
    public List<StoreDto> getAllStores() {
        return storeService.findAll();
    }

    @GetMapping("/{id}")
    public StoreDto getStore(@PathVariable Long id) {
        return storeService.findById(id);
    }

    @PostMapping
    public StoreDto createStore(@RequestBody StoreDto storeDto) {
        return storeService.create(storeDto);
    }

    @DeleteMapping("/{id}")
    public void deleteStore(@PathVariable Long id) {
        storeService.delete(id);
    }

    @PutMapping("/{id}")
    public StoreDto updateStore(@PathVariable Long id, @RequestBody StoreDto update) {
        return storeService.update(id, update);
    }
} 