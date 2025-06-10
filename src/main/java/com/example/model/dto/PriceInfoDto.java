package com.example.model.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceInfoDto {
    private Long id;
    private int price;
    private int reportCount;
    private LocalDateTime createdAt;
    private Long productId;
    private Long storeId;
    private String storeName;
}
