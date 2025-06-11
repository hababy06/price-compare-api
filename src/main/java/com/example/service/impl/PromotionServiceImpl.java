package com.example.service.impl;

import com.example.model.dto.PromotionDto;
import com.example.model.entity.PriceInfo;
import com.example.model.entity.Product;
import com.example.model.entity.Promotion;
import com.example.model.entity.Store;
import com.example.model.enums.PromotionType;
import com.example.repository.PriceInfoRepository;
import com.example.repository.ProductRepository;
import com.example.repository.PromotionRepository;
import com.example.repository.StoreRepository;
import com.example.service.PromotionService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PromotionServiceImpl implements PromotionService {

    @Autowired
    private PromotionRepository promotionRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private StoreRepository storeRepo;

    @Autowired
    private PriceInfoRepository priceInfoRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<PromotionDto> findAll() {
        return promotionRepo.findAll().stream()
                .map(p -> {
                    PromotionDto dto = modelMapper.map(p, PromotionDto.class);
                    dto.setStoreName(p.getStore().getName());
                    return dto;
                })
                .toList();
    }

    @Override
    public List<PromotionDto> findByProductAndStore(Long productId, Long storeId) {
        return promotionRepo.findByProductIdAndStoreId(productId, storeId).stream()
                .map(p -> {
                    PromotionDto dto = modelMapper.map(p, PromotionDto.class);
                    dto.setStoreName(p.getStore().getName());
                    return dto;
                })
                .toList();
    }

    @Override
    public PromotionDto create(PromotionDto dto) {
        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("找不到商品"));
        Store store = storeRepo.findById(dto.getStoreId())
                .orElseThrow(() -> new RuntimeException("找不到商店"));

        // 自動計算打折後價格
        if (dto.getType() == PromotionType.DISCOUNT && dto.getFinalPrice() == null) {
            if (dto.getDiscountValue() == null) {
                throw new RuntimeException("打折優惠需提供折數");
            }

            List<PriceInfo> priceList = priceInfoRepo.findByProductIdOrderByReportCountDescPriceAsc(dto.getProductId());
            if (priceList.isEmpty()) {
                throw new RuntimeException("找不到原價，無法計算折扣後價格");
            }

            int originalPrice = priceList.get(0).getPrice();
            int discounted = Math.round(originalPrice * (dto.getDiscountValue() / 100f));
            dto.setFinalPrice(discounted);
        }

        Promotion promotion = Promotion.builder()
                .type(dto.getType())
                .discountValue(dto.getDiscountValue())
                .finalPrice(dto.getFinalPrice())
                .remark(dto.getRemark())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .reportCount(1)
                .createdAt(LocalDateTime.now())
                .product(product)
                .store(store)
                .build();

        Promotion saved = promotionRepo.save(promotion);
        PromotionDto result = modelMapper.map(saved, PromotionDto.class);
        result.setStoreName(saved.getStore().getName());
        return result;
    }

    @Override
    public List<PromotionDto> findByProduct(Long productId) {
        return promotionRepo.findByProductIdOrderByReportCountDescFinalPriceAsc(productId).stream()
                .map(p -> {
                    PromotionDto dto = modelMapper.map(p, PromotionDto.class);
                    dto.setStoreName(p.getStore().getName());
                    return dto;
                })
                .toList();
    }
}
