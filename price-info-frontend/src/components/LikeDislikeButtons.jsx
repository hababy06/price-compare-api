import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const LikeDislikeButtons = ({ 
  itemId, 
  type, 
  likeStatus, 
  dislikeStatus, 
  likeCount, 
  dislikeCount, 
  onLike, 
  onDislike, 
  onDislikeClick 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const key = `${type}-${itemId}`;
  const isLiked = likeStatus[key];
  const isDisliked = dislikeStatus[key];

  const handleLikeClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await onLike(itemId, type);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDislikeClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (!isDisliked) {
        onDislikeClick(itemId, type);
      } else {
        await onDislike(itemId, type);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 互動按鈕 */}
      <div className="flex gap-2 mb-3">
        <button
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isLoading 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : isLiked 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          onClick={handleLikeClick}
          disabled={isLoading}
        >
          <FaThumbsUp className={`inline h-3 w-3 mr-1 ${isLoading ? 'animate-pulse' : ''}`} />
          {isLoading ? '處理中...' : (isLiked ? '已按讚' : '按讚')}
        </button>
        <button
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isLoading 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : isDisliked 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
          onClick={handleDislikeClick}
          disabled={isLoading}
        >
          <FaThumbsDown className={`inline h-3 w-3 mr-1 ${isLoading ? 'animate-pulse' : ''}`} />
          {isLoading ? '處理中...' : (isDisliked ? '已倒讚' : '倒讚')}
        </button>
      </div>

      {/* 統計資訊 */}
      <div className="flex justify-between text-xs text-gray-500">
        <span className={`${isLiked ? 'text-blue-600 font-medium' : ''}`}>
          👍 {likeCount[key] ?? 0} 人回報
        </span>
        <span className={`${isDisliked ? 'text-red-600 font-medium' : ''}`}>
          👎 {dislikeCount[key] ?? 0} 人倒讚
        </span>
      </div>
    </>
  );
};

export default LikeDislikeButtons; 