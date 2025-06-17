package com.example.service.impl;

import com.example.model.entity.PriceDislike;
import com.example.model.entity.PriceInfo;
import com.example.model.entity.User;
import com.example.repository.PriceDislikeRepository;
import com.example.repository.PriceInfoRepository;
import com.example.repository.PriceLikeRepository;
import com.example.repository.UserRepository;
import com.example.service.PriceDislikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PriceDislikeServiceImpl implements PriceDislikeService {

    @Autowired
    private PriceDislikeRepository priceDislikeRepository;
    @Autowired
    private PriceLikeRepository priceLikeRepository;
    @Autowired
    private PriceInfoRepository priceInfoRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public boolean dislikePrice(Long priceId, Long userId) {
        String uniqueKey = userId + ":" + priceId;
        // 先移除 like
        priceLikeRepository.findByUniqueKey(uniqueKey).ifPresent(priceLikeRepository::delete);
        // 如果已經倒讚，則移除倒讚
        if (priceDislikeRepository.findByUniqueKey(uniqueKey).isPresent()) {
            priceDislikeRepository.findByUniqueKey(uniqueKey).ifPresent(priceDislikeRepository::delete);
            return false;
        }
        PriceInfo priceInfo = priceInfoRepository.findById(priceId).orElseThrow(() -> new RuntimeException("Price not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        PriceDislike priceDislike = new PriceDislike();
        priceDislike.setPriceInfo(priceInfo);
        priceDislike.setUser(user);
        priceDislike.setUniqueKey(uniqueKey);
        priceDislikeRepository.save(priceDislike);
        return true;
    }

    @Override
    @Transactional
    public boolean undislikePrice(Long priceId, Long userId) {
        String uniqueKey = userId + ":" + priceId;
        return priceDislikeRepository.findByUniqueKey(uniqueKey)
                .map(dislike -> {
                    priceDislikeRepository.delete(dislike);
                    return true;
                })
                .orElse(false);
    }

    @Override
    public long getDislikeCount(Long priceId) {
        return priceDislikeRepository.countByPriceInfoId(priceId);
    }

    @Override
    public boolean hasDisliked(Long priceId, Long userId) {
        String uniqueKey = userId + ":" + priceId;
        return priceDislikeRepository.findByUniqueKey(uniqueKey).isPresent();
    }
} 