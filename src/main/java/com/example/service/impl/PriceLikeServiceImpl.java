package com.example.service.impl;

import com.example.model.entity.PriceInfo;
import com.example.model.entity.PriceLike;
import com.example.model.entity.User;
import com.example.repository.PriceInfoRepository;
import com.example.repository.UserRepository;
import com.example.repository.PriceLikeRepository;
import com.example.repository.PriceDislikeRepository;
import com.example.service.PriceLikeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PriceLikeServiceImpl implements PriceLikeService {

    private static final Logger log = LoggerFactory.getLogger(PriceLikeServiceImpl.class);

    @Autowired
    private PriceLikeRepository priceLikeRepository;

    @Autowired
    private PriceInfoRepository priceInfoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PriceDislikeRepository priceDislikeRepository;

    @Override
    @Transactional
    public boolean likePrice(Long priceId, Long userId) {
        String uniqueKey = userId + ":" + priceId;
        log.info("[likePrice] userId={}, priceId={}, uniqueKey={}", userId, priceId, uniqueKey);
        // 先移除倒讚
        priceDislikeRepository.findByUniqueKey(uniqueKey).ifPresent(priceDislikeRepository::delete);
        if (priceLikeRepository.findByUniqueKey(uniqueKey).isPresent()) {
            log.info("[likePrice] already liked, skip");
            return false; // 已按讚，不再重複
        }
        PriceInfo priceInfo = priceInfoRepository.findById(priceId).orElseThrow(() -> new RuntimeException("Price not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        PriceLike priceLike = PriceLike.builder()
            .priceInfo(priceInfo)
            .user(user)
            .uniqueKey(uniqueKey)
            .build();
        priceLikeRepository.save(priceLike);
        log.info("[likePrice] saved like record");
        return true;
    }

    @Override
    @Transactional
    public boolean unlikePrice(Long priceId, Long userId) {
        String uniqueKey = userId + ":" + priceId;
        return priceLikeRepository.findByUniqueKey(uniqueKey)
                .map(like -> {
                    priceLikeRepository.delete(like);
                    return true;
                })
                .orElse(false);
    }

    @Override
    public long getLikeCount(Long priceId) {
        return priceLikeRepository.countByPriceInfoId(priceId);
    }

    @Override
    public boolean hasLiked(Long priceId, Long userId) {
        String uniqueKey = userId + ":" + priceId;
        boolean exists = priceLikeRepository.findByUniqueKey(uniqueKey).isPresent();
        log.info("[hasLiked] userId={}, priceId={}, uniqueKey={}, exists={}", userId, priceId, uniqueKey, exists);
        return exists;
    }
} 