package com.example.model.dto;

import com.example.model.enums.PromotionType;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromotionDto {
    private Long id;
    private PromotionType type;
    private Integer discountValue;
    private Integer finalPrice;
    private String remark;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer reportCount;
    private LocalDateTime createdAt;
    private Long productId;
    private Long storeId;
    private String storeName; // ✅ 顯示用
    
    // 新增欄位
    private Boolean forceNew;      // 是否強制新增為新優惠
    private Long mergeWith;        // 要合併的優惠ID
    private Boolean addRemark;     // 是否要添加備註
} 
