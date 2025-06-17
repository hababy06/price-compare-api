package com.example.service.impl;

import com.example.model.entity.Promotion;
import com.example.model.entity.PromotionDislike;
import com.example.model.entity.User;
import com.example.repository.PromotionDislikeRepository;
import com.example.repository.PromotionLikeRepository;
import com.example.repository.PromotionRepository;
import com.example.repository.UserRepository;
import com.example.service.PromotionDislikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PromotionDislikeServiceImpl implements PromotionDislikeService {

    @Autowired
    private PromotionDislikeRepository promotionDislikeRepository;
    @Autowired
    private PromotionLikeRepository promotionLikeRepository;
    @Autowired
    private PromotionRepository promotionRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public boolean dislikePromotion(Long promotionId, Long userId) {
        String uniqueKey = userId + ":" + promotionId;
        // 先移除 like
        promotionLikeRepository.findByUniqueKey(uniqueKey).ifPresent(promotionLikeRepository::delete);
        
        // 如果已經倒讚，則移除倒讚
        if (promotionDislikeRepository.findByUniqueKey(uniqueKey).isPresent()) {
            promotionDislikeRepository.findByUniqueKey(uniqueKey).ifPresent(promotionDislikeRepository::delete);
            return false;
        }
        
        // 新增倒讚
        Promotion promotion = promotionRepository.findById(promotionId).orElseThrow(() -> new RuntimeException("Promotion not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        PromotionDislike promotionDislike = new PromotionDislike();
        promotionDislike.setPromotion(promotion);
        promotionDislike.setUser(user);
        promotionDislike.setUniqueKey(uniqueKey);
        promotionDislikeRepository.save(promotionDislike);
        return true;
    }

    @Override
    @Transactional
    public boolean undislikePromotion(Long promotionId, Long userId) {
        String uniqueKey = userId + ":" + promotionId;
        return promotionDislikeRepository.findByUniqueKey(uniqueKey)
                .map(dislike -> {
                    promotionDislikeRepository.delete(dislike);
                    return true;
                })
                .orElse(false);
    }

    @Override
    public long getDislikeCount(Long promotionId) {
        return promotionDislikeRepository.countByPromotionId(promotionId);
    }

    @Override
    public boolean hasDisliked(Long promotionId, Long userId) {
        String uniqueKey = userId + ":" + promotionId;
        return promotionDislikeRepository.findByUniqueKey(uniqueKey).isPresent();
    }
} 