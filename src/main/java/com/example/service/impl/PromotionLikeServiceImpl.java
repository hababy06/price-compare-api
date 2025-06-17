package com.example.service.impl;

import com.example.model.entity.PromotionLike;
import com.example.model.entity.Promotion;
import com.example.model.entity.User;
import com.example.repository.PromotionLikeRepository;
import com.example.repository.PromotionRepository;
import com.example.repository.UserRepository;
import com.example.repository.PromotionDislikeRepository;
import com.example.service.PromotionLikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PromotionLikeServiceImpl implements PromotionLikeService {
    @Autowired
    private PromotionLikeRepository likeRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private PromotionRepository promoRepo;
    @Autowired
    private PromotionDislikeRepository dislikeRepo;

    @Override
    public boolean like(Long userId, Long promotionId) {
        String uniqueKey = userId + ":" + promotionId;
        // 先移除 dislike
        dislikeRepo.findByUniqueKey(uniqueKey).ifPresent(dislikeRepo::delete);
        
        if (likeRepo.findByUniqueKey(uniqueKey).isPresent()) {
            return false;
        }
        
        User user = userRepo.findById(userId).orElseThrow();
        Promotion promo = promoRepo.findById(promotionId).orElseThrow();
        likeRepo.save(PromotionLike.builder()
            .user(user)
            .promotion(promo)
            .uniqueKey(uniqueKey)
            .build());
        return true;
    }

    @Override
    public boolean unlike(Long userId, Long promotionId) {
        String uniqueKey = userId + ":" + promotionId;
        return likeRepo.findByUniqueKey(uniqueKey)
            .map(like -> {
                likeRepo.delete(like);
                return true;
            })
            .orElse(false);
    }

    @Override
    public boolean hasLiked(Long userId, Long promotionId) {
        String uniqueKey = userId + ":" + promotionId;
        return likeRepo.findByUniqueKey(uniqueKey).isPresent();
    }

    @Override
    public int countLikes(Long promotionId) {
        return likeRepo.countByPromotionId(promotionId);
    }
} 