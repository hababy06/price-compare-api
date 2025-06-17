package com.example.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "promotion_like", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "promotion_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromotionLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "promotion_id", nullable = false)
    private Promotion promotion;

    @Column(nullable = false, unique = true)
    private String uniqueKey; // userId:promotionId

    private LocalDateTime createdAt = LocalDateTime.now();
} 