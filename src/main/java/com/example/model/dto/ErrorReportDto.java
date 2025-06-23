package com.example.model.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorReportDto {
    private Long targetId;
    private String targetType; // "promotion" or "price"
    private String errorType;
    private String description;
    private String reporterEmail; // 可選
} 