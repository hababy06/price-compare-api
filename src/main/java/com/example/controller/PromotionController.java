package com.example.controller;

import com.example.model.dto.PromotionDto;
import com.example.service.PromotionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "優惠資訊", description = "商品在商店的優惠與活動資料")
@RestController
@RequestMapping("/api/promotion-info")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @Operation(summary = "查詢某商品的所有優惠資訊")
    @GetMapping("/{productId}/promotions")
    public List<PromotionDto> getPromotions(@PathVariable Long productId) {
        return promotionService.findByProduct(productId);
    }

    @Operation(summary = "新增某商品的優惠資訊")
    @PostMapping("/{productId}/promotions")
    public PromotionDto createWithProduct(@PathVariable Long productId, @RequestBody PromotionDto dto) {
        dto.setProductId(productId);
        return promotionService.create(dto);
    }

    @Operation(summary = "查詢某商品在某商店的優惠資訊")
    @GetMapping("/query")
    public List<PromotionDto> getByProductAndStore(@RequestParam Long productId, @RequestParam Long storeId) {
        return promotionService.findByProductAndStore(productId, storeId);
    }

    @Operation(summary = "查詢全部優惠資訊")
    @GetMapping
    public List<PromotionDto> getAll() {
        return promotionService.findAll();
    }
} 
