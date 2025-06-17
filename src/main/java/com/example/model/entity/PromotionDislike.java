package com.example.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "promotion_dislike", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "promotion_id"}))
public class PromotionDislike {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    @Column(nullable = false, unique = true)
    private String uniqueKey; // userId:promotionId
} 