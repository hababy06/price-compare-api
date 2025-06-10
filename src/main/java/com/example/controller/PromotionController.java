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
@RequestMapping("/api/promotion-info") // ✅ 修改這行
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @Operation(summary = "查詢某商品的所有優惠資訊")
    @GetMapping("/{productId}/promotions") // ✅ 修改這行以符合前端 fetch
    public List<PromotionDto> getPromotions(@PathVariable Long productId) {
        return promotionService.findByProduct(productId);
    }

    @Operation(summary = "新增某商品的優惠資訊")
    @PostMapping("/{productId}/promotions") // ✅ 符合 REST 路徑邏輯
    public PromotionDto createWithProduct(@PathVariable Long productId, @RequestBody PromotionDto dto) {
        dto.setProductId(productId);
        return promotionService.create(dto);
    }

    // （可選保留）進階查詢功能
    @Operation(summary = "查詢某商品在某商店的優惠資訊")
    @GetMapping("/query")
    public List<PromotionDto> getByProductAndStore(@RequestParam Long productId, @RequestParam Long storeId) {
        return promotionService.findByProductAndStore(productId, storeId);
    }

    // （可選保留）後台使用：查詢全部優惠
    @Operation(summary = "查詢全部優惠資訊")
    @GetMapping
    public List<PromotionDto> getAll() {
        return promotionService.findAll();
    }
}
