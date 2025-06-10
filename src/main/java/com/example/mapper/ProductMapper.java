package com.example.mapper; 

import com.example.model.dto.ProductDto;
import com.example.model.entity.Product;
import org.modelmapper.ModelMapper;

public class ProductMapper {
    private static final ModelMapper modelMapper = new ModelMapper();

    public static ProductDto toDto(Product product) {
        return modelMapper.map(product, ProductDto.class);
    }
}
