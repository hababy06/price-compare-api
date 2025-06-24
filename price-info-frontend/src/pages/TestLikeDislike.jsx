import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useLikeDislike } from '../hooks/useLikeDislike';
import LikeDislikeButtons from '../components/LikeDislikeButtons';

const TestLikeDislike = () => {
  const [testItemId] = useState(1); // 測試用的商品ID
  const [testType] = useState('price'); // 測試類型
  const [user, setUser] = useState(null);

  const {
    likeStatus,
    likeCount,
    dislikeStatus,
    dislikeCount,
    handleLike,
    handleDislike,
    refreshLikeDislikeStatus
  } = useLikeDislike();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      refreshLikeDislikeStatus(testItemId, testType);
    }
  }, [testItemId, testType]);

  const handleDislikeClick = (itemId, type) => {
    console.log('倒讚點擊:', itemId, type);
    // 這裡可以添加倒讚對話框邏輯
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">按讚/倒讚功能測試</h1>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">測試項目</h2>
          <div className="space-y-4">
            <div>
              <p><strong>測試ID:</strong> {testItemId}</p>
              <p><strong>測試類型:</strong> {testType}</p>
              <p><strong>用戶狀態:</strong> {user ? '已登入' : '未登入'}</p>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">按讚/倒讚按鈕</h3>
              <LikeDislikeButtons
                itemId={testItemId}
                type={testType}
                likeStatus={likeStatus}
                dislikeStatus={dislikeStatus}
                likeCount={likeCount}
                dislikeCount={dislikeCount}
                onLike={handleLike}
                onDislike={handleDislike}
                onDislikeClick={handleDislikeClick}
              />
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">狀態資訊</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm">
                  {JSON.stringify({
                    likeStatus: likeStatus[`${testType}-${testItemId}`],
                    likeCount: likeCount[`${testType}-${testItemId}`],
                    dislikeStatus: dislikeStatus[`${testType}-${testItemId}`],
                    dislikeCount: dislikeCount[`${testType}-${testItemId}`]
                  }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">操作說明</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• 點擊「按讚」按鈕來測試按讚功能</li>
            <li>• 點擊「倒讚」按鈕來測試倒讚功能</li>
            <li>• 按讚和倒讚是互斥的，選擇一個會自動取消另一個</li>
            <li>• 再次點擊已選中的按鈕可以取消選擇</li>
            <li>• 請確保已登入才能使用這些功能</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestLikeDislike; 