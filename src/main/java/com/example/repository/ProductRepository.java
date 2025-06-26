package com.example.repository;

import com.example.model.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByName(String name);
    List<Product> findByNameContainingIgnoreCaseOrBarcodeContaining(String name, String barcode);
    List<Product> findByNameContainingIgnoreCaseOrBarcode(String name, String barcode);
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :k1, '%')) OR " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :k2, '%')) OR " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :k3, '%')) OR " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :k4, '%'))")
    List<Product> findByNameContainingAny(@Param("k1") String k1, @Param("k2") String k2, @Param("k3") String k3, @Param("k4") String k4);
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :k1, '%')) OR " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :k2, '%')) OR " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :k3, '%')) OR " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :k4, '%')) " +
           "ORDER BY CASE " +
           "WHEN LOWER(p.name) LIKE LOWER(CONCAT('%', :k1, '%')) THEN 1 " +
           "WHEN LOWER(p.name) LIKE LOWER(CONCAT('%', :k2, '%')) THEN 2 " +
           "WHEN LOWER(p.name) LIKE LOWER(CONCAT('%', :k3, '%')) THEN 3 " +
           "WHEN LOWER(p.name) LIKE LOWER(CONCAT('%', :k4, '%')) THEN 4 " +
           "ELSE 5 END")
    List<Product> findByNameContainingAnyOrderByWeight(@Param("k1") String k1, @Param("k2") String k2, @Param("k3") String k3, @Param("k4") String k4);
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :k1, '%')) OR " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :k2, '%')) OR " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :k3, '%')) OR " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :k4, '%')) OR " +
           "p.barcode = :barcode " +
           "ORDER BY CASE " +
           "WHEN LOWER(p.name) LIKE LOWER(CONCAT('%', :k1, '%')) THEN 1 " +
           "WHEN LOWER(p.name) LIKE LOWER(CONCAT('%', :k2, '%')) THEN 2 " +
           "WHEN LOWER(p.name) LIKE LOWER(CONCAT('%', :k3, '%')) THEN 3 " +
           "WHEN LOWER(p.name) LIKE LOWER(CONCAT('%', :k4, '%')) THEN 4 " +
           "WHEN p.barcode = :barcode THEN 0 " +
           "ELSE 5 END")
    List<Product> findByNameOrBarcodeAnyOrderByWeight(@Param("k1") String k1, @Param("k2") String k2, @Param("k3") String k3, @Param("k4") String k4, @Param("barcode") String barcode);
}
