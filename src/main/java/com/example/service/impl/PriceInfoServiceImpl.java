package com.example.service.impl;

import com.example.model.dto.PriceInfoDto;
import com.example.model.entity.PriceInfo;
import com.example.model.entity.Product;
import com.example.model.entity.Store;
import com.example.repository.PriceInfoRepository;
import com.example.repository.ProductRepository;
import com.example.repository.StoreRepository;
import com.example.service.PriceInfoService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PriceInfoServiceImpl implements PriceInfoService {

    @Autowired
    private PriceInfoRepository priceInfoRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private StoreRepository storeRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<PriceInfoDto> findAll() {
        return priceInfoRepo.findAll().stream()
                .map(p -> {
                    PriceInfoDto dto = modelMapper.map(p, PriceInfoDto.class);
                    dto.setStoreName(p.getStore().getName()); // ✅ 加上商店名稱
                    return dto;
                })
                .toList();
    }

    @Override
    public List<PriceInfoDto> findByProductAndStore(Long productId, Long storeId) {
        return priceInfoRepo.findByProductIdAndStoreId(productId, storeId).stream()
                .map(p -> {
                    PriceInfoDto dto = modelMapper.map(p, PriceInfoDto.class);
                    dto.setStoreName(p.getStore().getName()); // ✅ 加上商店名稱
                    return dto;
                })
                .toList();
    }

    @Override
    public PriceInfoDto create(PriceInfoDto dto) {
        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("找不到商品"));
        Store store = storeRepo.findById(dto.getStoreId())
                .orElseThrow(() -> new RuntimeException("找不到商店"));

        PriceInfo priceInfo = PriceInfo.builder()
                .price(dto.getPrice())
                .reportCount(1)
                .createdAt(LocalDateTime.now())
                .product(product)
                .store(store)
                .build();

        PriceInfo saved = priceInfoRepo.save(priceInfo);
        PriceInfoDto resultDto = modelMapper.map(saved, PriceInfoDto.class);
        resultDto.setStoreName(saved.getStore().getName()); // ✅ 加上商店名稱
        return resultDto;
    }

    @Override
    public List<PriceInfoDto> findByProduct(Long productId) {
        return priceInfoRepo.findByProductIdOrderByReportCountDescPriceAsc(productId)
                .stream()
                .map(p -> {
                    PriceInfoDto dto = modelMapper.map(p, PriceInfoDto.class);
                    dto.setStoreName(p.getStore().getName()); // ✅ 加上商店名稱
                    return dto;
                })
                .toList();
    }
}
