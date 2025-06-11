package com.example.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "price_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int price;

    private int reportCount;

    private LocalDateTime createdAt;

    // 商品關聯
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // 商店關聯
    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

}
