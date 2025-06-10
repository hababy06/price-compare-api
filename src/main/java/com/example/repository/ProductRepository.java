package com.example.repository;

import com.example.model.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByName(String name);
    List<Product> findByNameContainingIgnoreCaseOrBarcodeContaining(String name, String barcode);
    List<Product> findByNameContainingIgnoreCaseOrBarcode(String name, String barcode);

}
