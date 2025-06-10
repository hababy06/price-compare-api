package com.example.controller;

import com.example.model.dto.StoreDto;
import com.example.service.StoreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "商店管理", description = "提供商店的查詢、建立、刪除等操作")
@RestController
@RequestMapping("/api/stores")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class StoreController {

    @Autowired
    private StoreService storeService;

    @Operation(summary = "查詢所有商店")
    @GetMapping
    public List<StoreDto> getAllStores() {
        return storeService.findAll();
    }

    @Operation(summary = "查詢單一商店")
    @GetMapping("/{id}")
    public StoreDto getStore(@PathVariable Long id) {
        return storeService.findById(id);
    }

    @Operation(summary = "建立商店")
    @PostMapping
    public StoreDto createStore(@RequestBody StoreDto storeDto) {
        return storeService.create(storeDto);
    }

    @Operation(summary = "刪除商店")
    @DeleteMapping("/{id}")
    public void deleteStore(@PathVariable Long id) {
        storeService.delete(id);
    }
}
