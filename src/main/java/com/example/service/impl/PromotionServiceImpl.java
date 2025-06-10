package com.example.service.impl;

import com.example.model.dto.PromotionDto;
import com.example.model.entity.Product;
import com.example.model.entity.Promotion;
import com.example.model.entity.Store;
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
    private ModelMapper modelMapper;

    @Override
    public List<PromotionDto> findAll() {
        return promotionRepo.findAll().stream()
                .map(p -> modelMapper.map(p, PromotionDto.class))
                .toList();
    }

    @Override
    public List<PromotionDto> findByProductAndStore(Long productId, Long storeId) {
        return promotionRepo.findByProductIdAndStoreId(productId, storeId).stream()
                .map(p -> modelMapper.map(p, PromotionDto.class))
                .toList();
    }

    @Override
    public PromotionDto create(PromotionDto dto) {
        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("找不到商品"));
        Store store = storeRepo.findById(dto.getStoreId())
                .orElseThrow(() -> new RuntimeException("找不到商店"));

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

        return modelMapper.map(promotionRepo.save(promotion), PromotionDto.class);
    }

	@Override
	public List<PromotionDto> findByProduct(Long productId) {
		// TODO Auto-generated method stub
		return null;
	}
}
