package com.example.service.impl;

import com.example.model.dto.ProductDto;
import com.example.model.entity.Product;
import com.example.repository.ProductRepository;
import com.example.service.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import com.example.mapper.ProductMapper;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<ProductDto> findAll() {
        return productRepository.findAll().stream()
                .map(p -> modelMapper.map(p, ProductDto.class))
                .toList();
    }

    @Override
    public ProductDto findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("找不到商品"));
        return modelMapper.map(product, ProductDto.class);
    }

    @Override
    public ProductDto create(ProductDto productDto) {
        Product product = modelMapper.map(productDto, Product.class);
        return modelMapper.map(productRepository.save(product), ProductDto.class);
    }

    @Override
    public void delete(Long id) {
        productRepository.deleteById(id);
    }
    @Override
    public List<ProductDto> search(String keyword) {
        List<Product> products = productRepository.findByNameContainingIgnoreCaseOrBarcode(keyword, keyword);
        return products.stream().map(ProductMapper::toDto).collect(Collectors.toList());
    }

    

}
 