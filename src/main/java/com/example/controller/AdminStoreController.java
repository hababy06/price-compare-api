package com.example.controller;

import com.example.model.entity.Store;
import com.example.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/stores")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStoreController {
    @Autowired
    private StoreRepository storeRepository;

    @GetMapping
    public List<Store> getAll() {
        return storeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Store> getOne(@PathVariable Long id) {
        return storeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Store update) {
        return storeRepository.findById(id).map(store -> {
            store.setName(update.getName());
            store.setAddress(update.getAddress());
            store.setLogoUrl(update.getLogoUrl());
            storeRepository.save(store);
            return ResponseEntity.ok().body("商店已更新");
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!storeRepository.existsById(id)) return ResponseEntity.notFound().build();
        storeRepository.deleteById(id);
        return ResponseEntity.ok().body("商店已刪除");
    }
} 