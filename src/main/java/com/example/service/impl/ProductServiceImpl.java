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
import com.example.model.dto.ProductWithPricesAndStoresDto;
import com.example.model.dto.PriceWithStoreDto;
import com.example.model.dto.StoreDto;
import com.example.model.entity.Store;
import com.example.model.entity.PriceInfo;
import com.example.repository.StoreRepository;
import com.example.repository.PriceInfoRepository;
import java.time.LocalDateTime;
import com.example.util.SynonymUtil;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private PriceInfoRepository priceInfoRepository;

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
        String[] keys = SynonymUtil.getSynonyms(keyword);
        String k1 = keys.length > 0 ? keys[0] : "__NULL__";
        String k2 = keys.length > 1 ? keys[1] : "__NULL__";
        String k3 = keys.length > 2 ? keys[2] : "__NULL__";
        String k4 = keys.length > 3 ? keys[3] : "__NULL__";
        List<Product> products = productRepository.findByNameOrBarcodeAnyOrderByWeight(k1, k2, k3, k4, keyword);
        return products.stream().map(ProductMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public void batchImport(List<ProductDto> products) {
        for (ProductDto dto : products) {
            // 可加重複檢查
            if (!productRepository.existsByName(dto.getName())) {
                productRepository.save(modelMapper.map(dto, Product.class));
            }
        }
    }

    @Override
    public void batchImportWithStores(List<ProductWithPricesAndStoresDto> products) {
        for (ProductWithPricesAndStoresDto productDto : products) {
            // 建立商品
            Product product = Product.builder()
                .name(productDto.getName())
                .barcode(productDto.getBarcode())
                .imageUrl(productDto.getImageUrl())
                .build();
            product = productRepository.save(product);

            // 建立價格與商店
            if (productDto.getPrices() != null) {
                for (PriceWithStoreDto priceDto : productDto.getPrices()) {
                    StoreDto storeDto = priceDto.getStore();
                    Store store = storeRepository.existsByName(storeDto.getName())
                        ? storeRepository.findAll().stream().filter(s -> s.getName().equals(storeDto.getName())).findFirst().get()
                        : storeRepository.save(Store.builder()
                            .name(storeDto.getName())
                            .address(storeDto.getAddress())
                            .logoUrl(storeDto.getLogoUrl())
                            .build());

                    PriceInfo priceInfo = PriceInfo.builder()
                        .price(priceDto.getPrice())
                        .reportCount(1)
                        .createdAt(LocalDateTime.now())
                        .product(product)
                        .store(store)
                        .build();
                    priceInfoRepository.save(priceInfo);
                }
            }
        }
    }

}
 