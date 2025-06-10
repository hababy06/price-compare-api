package com.example.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "promotion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // 折扣、特價、買一送一等
    private int discountValue; // 若是打折（ex: 85折則填85），否則為0
    private int finalPrice;    // 最終優惠價（無折扣可設為0）
    private String remark;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private int reportCount;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;
}
