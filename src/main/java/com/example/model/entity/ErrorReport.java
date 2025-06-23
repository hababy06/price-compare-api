package com.example.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long targetId; // 被回報的對象ID
    private String targetType; // "promotion" or "price"
    private String errorType; // 錯誤類型
    private String description; // 備註
    private String reporterEmail; // 可選
    private LocalDateTime createdAt;
    private String username; // 新增這一行
} 