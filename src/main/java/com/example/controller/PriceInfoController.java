package com.example.controller;

import com.example.model.dto.PriceInfoDto;
import com.example.service.PriceInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "價格資訊", description = "商品在商店的價格與回報數")
@RestController
@RequestMapping("/api/price-info")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PriceInfoController {

    @Autowired
    private PriceInfoService priceInfoService;

    @Operation(summary = "查詢全部價格資訊")
    @GetMapping
    public List<PriceInfoDto> getAll() {
        return priceInfoService.findAll();
    }

    @Operation(summary = "查詢某商品在某商店的所有價格資訊")
    @GetMapping("/query")
    public List<PriceInfoDto> getByProductAndStore(@RequestParam Long productId, @RequestParam Long storeId) {
        return priceInfoService.findByProductAndStore(productId, storeId);
    }

    @Operation(summary = "新增價格資訊")
    @PostMapping
    public PriceInfoDto create(@RequestBody PriceInfoDto dto) {
        return priceInfoService.create(dto);
    }

    @GetMapping("/{productId}/prices")
    public List<PriceInfoDto> getPrices(@PathVariable Long productId) {
        return priceInfoService.findByProduct(productId);
    }
}
