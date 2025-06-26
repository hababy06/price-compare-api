package com.example.controller;

import com.example.model.entity.Product;
import com.example.repository.ProductRepository;
import com.example.service.ProductService;
import com.example.model.dto.ProductDto;
import com.example.model.dto.ProductWithPricesAndStoresDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getOne(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Product update) {
        return productRepository.findById(id).map(product -> {
            product.setName(update.getName());
            product.setBarcode(update.getBarcode());
            product.setImageUrl(update.getImageUrl());
            productRepository.save(product);
            return ResponseEntity.ok().body("商品已更新");
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!productRepository.existsById(id)) return ResponseEntity.notFound().build();
        productRepository.deleteById(id);
        return ResponseEntity.ok().body("商品已刪除");
    }

    @PostMapping("/batch-import")
    public ResponseEntity<?> batchImport(@RequestBody List<ProductDto> products) {
        productService.batchImport(products);
        return ResponseEntity.ok("匯入成功");
    }

    @PostMapping("/batch-import-with-stores")
    public ResponseEntity<?> batchImportWithStores(@RequestBody List<ProductWithPricesAndStoresDto> products) {
        productService.batchImportWithStores(products);
        return ResponseEntity.ok("匯入成功");
    }
} 