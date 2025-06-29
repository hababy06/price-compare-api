package com.example.repository;

import com.example.model.entity.PriceInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PriceInfoRepository extends JpaRepository<PriceInfo, Long> {
    List<PriceInfo> findByProductIdAndStoreId(Long productId, Long storeId);
    List<PriceInfo> findByProductIdOrderByReportCountDescPriceAsc(Long productId);
    List<PriceInfo> findByProductIdOrderByPriceAscReportCountDesc(Long productId);
    List<PriceInfo> findByProductIdAndStoreIdOrderByReportCountDescPriceAsc(Long productId, Long storeId);
    List<PriceInfo> findByProductIdAndStoreIdOrderByCreatedAtDesc(Long productId, Long storeId);


}
