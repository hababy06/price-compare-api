import React from 'react';
import LikeDislikeButtons from './LikeDislikeButtons';

const PriceCard = ({ 
  price, 
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
  if (view === 'grid') {
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 fade-in" style={{animationDelay: `${0.4 + index * 0.1}s`}}>
        {/* 商店資訊 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={price.storeLogoUrl || 'https://dummyimage.com/48x48/cccccc/ffffff&text=No+Logo'}
              alt={price.storeName}
              className="w-12 h-12 object-cover rounded-lg"
              onError={e => {
                if (!e.target.dataset.fallback) {
                  e.target.src = 'https://dummyimage.com/48x48/cccccc/ffffff&text=No+Logo';
                  e.target.dataset.fallback = '1';
                }
              }}
            />
            <div>
              <h3 className="font-semibold text-gray-800">{price.storeName}</h3>
              <p className="text-sm text-gray-500">商店價格</p>
            </div>
          </div>
        </div>

        {/* 價格資訊 */}
        <div className="p-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl text-center mb-4">
            <div className="text-2xl font-bold text-blue-600 mb-1">${price.price}</div>
            <div className="text-sm text-gray-600">商品價格</div>
          </div>

          <LikeDislikeButtons
            itemId={price.id}
            type="price"
            likeStatus={likeStatus}
            dislikeStatus={dislikeStatus}
            likeCount={likeCount}
            dislikeCount={dislikeCount}
            onLike={onLike}
            onDislike={onDislike}
            onDislikeClick={onDislikeClick}
            view={view}
          />
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 fade-in" style={{animationDelay: `${0.4 + index * 0.1}s`}}>
      <div className="flex items-center p-6">
        {/* 商店資訊 */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <img
            src={price.storeLogoUrl || 'https://dummyimage.com/64x64/cccccc/ffffff&text=No+Logo'}
            alt={price.storeName}
            className="w-16 h-16 object-cover rounded-lg"
            onError={e => {
              if (!e.target.dataset.fallback) {
                e.target.src = 'https://dummyimage.com/64x64/cccccc/ffffff&text=No+Logo';
                e.target.dataset.fallback = '1';
              }
            }}
          />
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{price.storeName}</h3>
            <p className="text-sm text-gray-500">商店價格</p>
          </div>
        </div>

        {/* 價格資訊 */}
        <div className="flex-1 ml-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">${price.price}</div>
            <div className="text-sm text-gray-600">商品價格</div>
          </div>
        </div>

        {/* 互動按鈕和統計資訊 */}
        <div className="flex flex-col items-end gap-3 ml-6">
          <LikeDislikeButtons
            itemId={price.id}
            type="price"
            likeStatus={likeStatus}
            dislikeStatus={dislikeStatus}
            likeCount={likeCount}
            dislikeCount={dislikeCount}
            onLike={onLike}
            onDislike={onDislike}
            onDislikeClick={onDislikeClick}
            view={view}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceCard; 