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
import java.time.temporal.ChronoUnit;

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
                    dto.setStoreLogoUrl(p.getStore().getLogoUrl());
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
                    dto.setStoreLogoUrl(p.getStore().getLogoUrl());
                    return dto;
                })
                .toList();
    }

    @Override
    public PromotionDto checkSimilarPromotion(PromotionDto dto) {
        // 查詢該商品在該商店的所有優惠
        List<Promotion> existingPromotions = promotionRepo.findByProductIdAndStoreId(dto.getProductId(), dto.getStoreId());

        // 計算新優惠的最終價格
        Integer finalPrice = calculateFinalPrice(dto, 
            productRepo.findById(dto.getProductId()).orElseThrow(() -> new RuntimeException("找不到商品")),
            storeRepo.findById(dto.getStoreId()).orElseThrow(() -> new RuntimeException("找不到商店"))
        );

        // 尋找可以合併的優惠
        for (Promotion existingPromo : existingPromotions) {
            if (canMergePromotions(existingPromo, dto, finalPrice)) {
                PromotionDto result = modelMapper.map(existingPromo, PromotionDto.class);
                result.setStoreName(existingPromo.getStore().getName());
                result.setStoreLogoUrl(existingPromo.getStore().getLogoUrl());
                return result;
            }
        }

        return null;
    }

    @Override
    public PromotionDto create(PromotionDto dto) {
        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("找不到商品"));
        Store store = storeRepo.findById(dto.getStoreId())
                .orElseThrow(() -> new RuntimeException("找不到商店"));

        // 計算新優惠的最終價格
        Integer finalPrice = calculateFinalPrice(dto, product, store);

        // 如果指定要強制新增或合併到特定優惠
        if (dto.getForceNew() != null && dto.getForceNew()) {
            return createNewPromotion(dto, product, store, finalPrice);
        }

        if (dto.getMergeWith() != null) {
            Promotion existingPromo = promotionRepo.findById(dto.getMergeWith())
                    .orElseThrow(() -> new RuntimeException("找不到要合併的優惠"));
            
            // 合併優惠
            mergePromotions(existingPromo, dto, finalPrice);
            if (dto.getAddRemark() != null && dto.getAddRemark() && dto.getRemark() != null) {
                existingPromo.setRemark(existingPromo.getRemark() + " | " + dto.getRemark());
            }
            
            Promotion saved = promotionRepo.save(existingPromo);
            PromotionDto result = modelMapper.map(saved, PromotionDto.class);
            result.setStoreName(saved.getStore().getName());
            result.setStoreLogoUrl(saved.getStore().getLogoUrl());
            return result;
        }

        // 查詢該商品在該商店的所有優惠
        List<Promotion> existingPromotions = promotionRepo.findByProductIdAndStoreId(dto.getProductId(), dto.getStoreId());

        // 尋找可以合併的優惠
        for (Promotion existingPromo : existingPromotions) {
            if (canMergePromotions(existingPromo, dto, finalPrice)) {
                // 合併優惠
                mergePromotions(existingPromo, dto, finalPrice);
                Promotion saved = promotionRepo.save(existingPromo);
                PromotionDto result = modelMapper.map(saved, PromotionDto.class);
                result.setStoreName(saved.getStore().getName());
                result.setStoreLogoUrl(saved.getStore().getLogoUrl());
                return result;
            }
        }

        // 如果沒有找到可以合併的優惠，創建新的優惠
        return createNewPromotion(dto, product, store, finalPrice);
    }

    private PromotionDto createNewPromotion(PromotionDto dto, Product product, Store store, Integer finalPrice) {
        Promotion promotion = Promotion.builder()
                .type(dto.getType())
                .discountValue(dto.getDiscountValue())
                .finalPrice(finalPrice)
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
        result.setStoreLogoUrl(saved.getStore().getLogoUrl());
        return result;
    }

    private boolean canMergePromotions(Promotion existing, PromotionDto newPromo, Integer newFinalPrice) {
        // 1. 檢查優惠類型是否相同
        if (existing.getType() != newPromo.getType()) {
            return false;
        }

        // 2. 檢查價格是否相近（允許 5% 的誤差）
        if (existing.getFinalPrice() != null && newFinalPrice != null) {
            double priceDiff = Math.abs(existing.getFinalPrice() - newFinalPrice);
            double priceThreshold = existing.getFinalPrice() * 0.05; // 5% 誤差
            if (priceDiff > priceThreshold) {
                return false;
            }
        }

        // 3. 檢查時間是否重疊或相近
        if (existing.getStartTime() != null && existing.getEndTime() != null &&
            newPromo.getStartTime() != null && newPromo.getEndTime() != null) {
            // 檢查時間是否重疊
            if (newPromo.getEndTime().isBefore(existing.getStartTime()) ||
                newPromo.getStartTime().isAfter(existing.getEndTime())) {
                // 如果時間不重疊，檢查是否相近（7天內）
                if (Math.abs(ChronoUnit.DAYS.between(existing.getEndTime(), newPromo.getStartTime())) > 7 &&
                    Math.abs(ChronoUnit.DAYS.between(existing.getStartTime(), newPromo.getEndTime())) > 7) {
                    return false;
                }
            }
        }

        return true;
    }

    private void mergePromotions(Promotion existing, PromotionDto newPromo, Integer newFinalPrice) {
        // 1. 增加回報數
        existing.setReportCount(existing.getReportCount() + 1);

        // 2. 更新優惠時間
        if (newPromo.getStartTime() != null && newPromo.getEndTime() != null) {
            // 如果現有優惠沒有時間限制，直接使用新優惠的時間
            if (existing.getStartTime() == null || existing.getEndTime() == null) {
                existing.setStartTime(newPromo.getStartTime());
                existing.setEndTime(newPromo.getEndTime());
            } else {
                // 取最早的開始時間和最晚的結束時間
                existing.setStartTime(existing.getStartTime().isBefore(newPromo.getStartTime()) 
                    ? existing.getStartTime() 
                    : newPromo.getStartTime());
                existing.setEndTime(existing.getEndTime().isAfter(newPromo.getEndTime()) 
                    ? existing.getEndTime() 
                    : newPromo.getEndTime());
            }
        }

        // 3. 更新優惠價格（取最優惠的價格）
        if (newFinalPrice != null) {
            if (existing.getFinalPrice() == null || newFinalPrice < existing.getFinalPrice()) {
                existing.setFinalPrice(newFinalPrice);
                existing.setDiscountValue(newPromo.getDiscountValue());
            }
        }

        // 4. 合併備註（如果新優惠有備註）
        if (newPromo.getRemark() != null && !newPromo.getRemark().trim().isEmpty()) {
            if (existing.getRemark() == null || existing.getRemark().trim().isEmpty()) {
                existing.setRemark(newPromo.getRemark());
            } else if (!existing.getRemark().contains(newPromo.getRemark())) {
                existing.setRemark(existing.getRemark() + " | " + newPromo.getRemark());
            }
        }
    }

    private Integer calculateFinalPrice(PromotionDto dto, Product product, Store store) {
        if (dto.getType() == PromotionType.DISCOUNT) {
            // 查詢該商品在該商店的最新價格
            List<PriceInfo> priceList = priceInfoRepo.findByProductIdAndStoreIdOrderByCreatedAtDesc(dto.getProductId(), dto.getStoreId());
            if (priceList.isEmpty()) {
                throw new RuntimeException("找不到原價，無法計算折扣後價格");
            }
            int originalPrice = priceList.get(0).getPrice();
            if (dto.getDiscountValue() == null) {
                throw new RuntimeException("打折優惠需提供折數");
            }
            // 例如 85折 = 0.85
            float discount;
            if (dto.getDiscountValue() < 10) {
                // 8 => 0.8
                discount = dto.getDiscountValue() / 10f;
            } else {
                // 85 => 0.85
                discount = dto.getDiscountValue() / 100f;
            }
            return Math.round(originalPrice * discount);
        } else if (dto.getType() == PromotionType.SPECIAL) {
            // 特價直接使用 finalPrice
            if (dto.getFinalPrice() == null) {
                throw new RuntimeException("特價優惠需提供特價金額");
            }
            return dto.getFinalPrice();
        }
        return null;
    }

    @Override
    public List<PromotionDto> findByProduct(Long productId) {
        return promotionRepo.findByProductIdOrderByReportCountDescFinalPriceAsc(productId).stream()
                .map(p -> {
                    PromotionDto dto = modelMapper.map(p, PromotionDto.class);
                    dto.setStoreName(p.getStore().getName());
                    dto.setStoreLogoUrl(p.getStore().getLogoUrl());
                    return dto;
                })
                .toList();
    }

    @Override
    public List<PromotionDto> findByProductOrderByFinalPrice(Long productId) {
        return promotionRepo.findByProductIdOrderByFinalPriceAscReportCountDesc(productId).stream()
                .map(p -> {
                    PromotionDto dto = modelMapper.map(p, PromotionDto.class);
                    dto.setStoreName(p.getStore().getName());
                    dto.setStoreLogoUrl(p.getStore().getLogoUrl());
                    return dto;
                })
                .toList();
    }
}
