import React from 'react';
import { FaClock } from 'react-icons/fa';
import LikeDislikeButtons from './LikeDislikeButtons';

const PromotionCard = ({ 
  promo, 
  index, 
  view, 
  likeStatus, 
  dislikeStatus, 
  likeCount, 
  dislikeCount, 
  onLike, 
  onDislike, 
  onDislikeClick 
}) => {
  const getPromotionTypeLabel = (type, discountValue) => {
    switch (type) {
      case 'DISCOUNT':
        return discountValue ? `${discountValue}折` : '打折';
      case 'SPECIAL':
        return '特價';
      case 'BUY_ONE_GET_ONE':
        return '買一送一';
      case 'COUPON':
        return '折價券';
      case 'LIMITED_TIME':
        return '限時搶購';
      default:
        return type;
    }
  };

  const getPromotionTypeStyle = (type) => {
    switch (type) {
      case 'DISCOUNT':
        return 'bg-blue-100 text-blue-800';
      case 'SPECIAL':
        return 'bg-red-100 text-red-800';
      case 'BUY_ONE_GET_ONE':
        return 'bg-green-100 text-green-800';
      case 'COUPON':
        return 'bg-yellow-100 text-yellow-800';
      case 'LIMITED_TIME':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (view === 'grid') {
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 fade-in relative" style={{animationDelay: `${index * 0.1}s`}}>
        {/* 優惠類型標籤 */}
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getPromotionTypeStyle(promo.type)}`}>
            {getPromotionTypeLabel(promo.type, promo.discountValue)}
          </span>
        </div>

        {/* 商店資訊 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={promo.storeLogoUrl || 'https://dummyimage.com/48x48/cccccc/ffffff&text=No+Logo'}
              alt={promo.storeName}
              className="w-12 h-12 object-cover rounded-lg"
              onError={e => {
                if (!e.target.dataset.fallback) {
                  e.target.src = 'https://dummyimage.com/48x48/cccccc/ffffff&text=No+Logo';
                  e.target.dataset.fallback = '1';
                }
              }}
            />
            <div>
              <h3 className="font-semibold text-gray-800">{promo.storeName}</h3>
              <p className="text-sm text-gray-500">優惠活動</p>
            </div>
          </div>
        </div>

        {/* 優惠資訊 */}
        <div className="p-6">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl text-center mb-4">
            <div className="text-2xl font-bold text-orange-600 mb-1">${promo.finalPrice}</div>
            <div className="text-sm text-gray-600">優惠價格</div>
            {promo.originalPrice && promo.originalPrice > promo.finalPrice && (
              <div className="text-sm text-gray-500 line-through mt-1">原價 ${promo.originalPrice}</div>
            )}
          </div>

          {promo.description && (
            <div className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
              {promo.description}
            </div>
          )}

          {promo.expiryDate && (
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <FaClock className="h-4 w-4 mr-2" />
              有效期至: {new Date(promo.expiryDate).toLocaleDateString()}
            </div>
          )}

          <LikeDislikeButtons
            itemId={promo.id}
            type="promotion"
            likeStatus={likeStatus}
            dislikeStatus={dislikeStatus}
            likeCount={likeCount}
            dislikeCount={dislikeCount}
            onLike={onLike}
            onDislike={onDislike}
            onDislikeClick={onDislikeClick}
          />
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 fade-in flex items-center p-6 relative" style={{animationDelay: `${0.2 + index * 0.1}s`}}>
      {/* 商店資訊 */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <img
          src={promo.storeLogoUrl || 'https://dummyimage.com/64x64/cccccc/ffffff&text=No+Logo'}
          alt={promo.storeName}
          className="w-16 h-16 object-cover rounded-lg"
          onError={e => {
            if (!e.target.dataset.fallback) {
              e.target.src = 'https://dummyimage.com/64x64/cccccc/ffffff&text=No+Logo';
              e.target.dataset.fallback = '1';
            }
          }}
        />
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{promo.storeName}</h3>
            <p className="text-sm text-gray-500">優惠活動</p>
          </div>
          {/* 優惠類型標籤 */}
          <span className={`px-4 py-2 rounded-full text-base font-medium ${getPromotionTypeStyle(promo.type)}`}>
            {getPromotionTypeLabel(promo.type, promo.discountValue)}
          </span>
        </div>
      </div>

      {/* 優惠資訊 */}
      <div className="flex-1 ml-6">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl text-center">
          <div className="text-3xl font-bold text-orange-600 mb-1">${promo.finalPrice}</div>
          <div className="text-sm text-gray-600">優惠價格</div>
          {promo.originalPrice && promo.originalPrice > promo.finalPrice && (
            <div className="text-sm text-gray-500 line-through mt-1">原價 ${promo.originalPrice}</div>
          )}
        </div>
        {promo.description && (
          <div className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded-lg">
            {promo.description}
          </div>
        )}
      </div>

      {/* 互動按鈕和統計資訊 */}
      <div className="flex flex-col items-end gap-3 ml-6">
        <LikeDislikeButtons
          itemId={promo.id}
          type="promotion"
          likeStatus={likeStatus}
          dislikeStatus={dislikeStatus}
          likeCount={likeCount}
          dislikeCount={dislikeCount}
          onLike={onLike}
          onDislike={onDislike}
          onDislikeClick={onDislikeClick}
        />
      </div>
    </div>
  );
};

export default PromotionCard; 