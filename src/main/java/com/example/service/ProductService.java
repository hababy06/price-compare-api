package com.example.service;

import com.example.model.dto.ProductDto;
import java.util.List;

public interface ProductService {
    List<ProductDto> findAll();
    ProductDto findById(Long id);
    ProductDto create(ProductDto productDto);
    void delete(Long id);
    List<ProductDto> search(String query);

}
