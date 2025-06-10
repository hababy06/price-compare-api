package com.example.model.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromotionDto {
    private Long id;
    private String type;
    private int discountValue;
    private int finalPrice;
    private String remark;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int reportCount;
    private LocalDateTime createdAt;
    private Long productId;
    private Long storeId;
}
