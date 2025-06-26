package com.example.model.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductWithPricesAndStoresDto {
    private String name;
    private String barcode;
    private String imageUrl;
    private List<PriceWithStoreDto> prices;
}
