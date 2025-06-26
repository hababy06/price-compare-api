package com.example.service;

import com.example.model.dto.ProductDto;
import com.example.model.dto.ProductWithPricesAndStoresDto;
import java.util.List;

public interface ProductService {
    List<ProductDto> findAll();
    ProductDto findById(Long id);
    ProductDto create(ProductDto productDto);
    void delete(Long id);
    List<ProductDto> search(String keyword);
    void batchImport(List<ProductDto> products);
    void batchImportWithStores(List<ProductWithPricesAndStoresDto> products);
}
