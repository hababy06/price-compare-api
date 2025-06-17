package com.example.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "price_dislike", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "price_info_id"}))
public class PriceDislike {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "price_info_id")
    private PriceInfo priceInfo;

    @Column(nullable = false, unique = true)
    private String uniqueKey; // userId:priceId
} 