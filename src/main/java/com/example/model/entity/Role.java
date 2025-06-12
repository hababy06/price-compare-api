package com.example.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Role {
    @Id @GeneratedValue
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // e.g. USER, ADMIN
}