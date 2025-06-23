import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaStore, FaFire, FaDollarSign, FaThumbsUp, FaThumbsDown, FaPlus, FaExclamationTriangle, FaClock, FaList, FaTh } from 'react-icons/fa';
import { authService } from "../services/authService";
import axios from "axios";
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';

const Compare = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [priceList, setPriceList] = useState([]);
  const [promotionList, setPromotionList] = useState([]);
  const [likeStatus, setLikeStatus] = useState({});
  const [likeCount, setLikeCount] = useState({});
  const [dislikeStatus, setDislikeStatus] = useState({});
  const [dislikeCount, setDislikeCount] = useState({});
  const [openDislikeDialog, setOpenDislikeDialog] = useState(false);
  const [currentDislikeId, setCurrentDislikeId] = useState(null);
  const [currentDislikeType, setCurrentDislikeType] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('report'); // 'report' or 'price'

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(setProduct)
      .catch(() => alert('載入商品失敗'));

    // 根據排序方式獲取價格資料
    const priceUrl = sortBy === 'price' 
      ? `/api/price-info/${id}/prices/sorted-by-price`
      : `/api/price-info/${id}/prices`;
    
    console.log('Fetching prices from:', priceUrl); // 調試信息
    
    fetch(priceUrl)
      .then(res => {
        console.log('Price response status:', res.status); // 調試信息
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(async (prices) => {
        console.log('Prices received:', prices); // 調試信息
        setPriceList(prices);
        const user = authService.getCurrentUser();
        const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
        const likeStatusObj = {};
        const likeCountObj = {};
        const dislikeStatusObj = {};
        const dislikeCountObj = {};
        await Promise.all(prices.map(async (price) => {
          try {
            const countRes = await axios.get(`/price-likes/${price.id}/count`);
            likeCountObj[`price-${price.id}`] = countRes.data.count;
          } catch {
            likeCountObj[`price-${price.id}`] = price.reportCount || 0;
          }
          try {
            const countRes = await axios.get(`/price-dislikes/${price.id}/count`);
            dislikeCountObj[`price-${price.id}`] = countRes.data.count;
          } catch {
            dislikeCountObj[`price-${price.id}`] = 0;
          }
          if (user) {
            try {
              const res = await axios.get(`/price-likes/${price.id}/has-liked`, { headers });
              likeStatusObj[`price-${price.id}`] = res.data.hasLiked;
            } catch {
              likeStatusObj[`price-${price.id}`] = false;
            }
            try {
              const res = await axios.get(`/price-dislikes/${price.id}/has-disliked`, { headers });
              dislikeStatusObj[`price-${price.id}`] = res.data.hasDisliked;
            } catch {
              dislikeStatusObj[`price-${price.id}`] = false;
            }
          } else {
            likeStatusObj[`price-${price.id}`] = false;
            dislikeStatusObj[`price-${price.id}`] = false;
          }
        }));
        // 清空之前的價格相關狀態，只保留優惠相關狀態
        setLikeStatus(prev => {
          const newState = {};
          Object.keys(prev).forEach(key => {
            if (key.startsWith('promo-')) {
              newState[key] = prev[key];
            }
          });
          return { ...newState, ...likeStatusObj };
        });
        setLikeCount(prev => {
          const newState = {};
          Object.keys(prev).forEach(key => {
            if (key.startsWith('promo-')) {
              newState[key] = prev[key];
            }
          });
          return { ...newState, ...likeCountObj };
        });
        setDislikeStatus(prev => {
          const newState = {};
          Object.keys(prev).forEach(key => {
            if (key.startsWith('promo-')) {
              newState[key] = prev[key];
            }
          });
          return { ...newState, ...dislikeStatusObj };
        });
        setDislikeCount(prev => {
          const newState = {};
          Object.keys(prev).forEach(key => {
            if (key.startsWith('promo-')) {
              newState[key] = prev[key];
            }
          });
          return { ...newState, ...dislikeCountObj };
        });
      })
      .catch((error) => {
        console.error('Error fetching prices:', error); // 調試信息
        alert('載入價格資訊失敗: ' + error.message);
        setPriceList([]);
      });

    // 根據排序方式獲取優惠資料
    const promotionUrl = sortBy === 'price'
      ? `/api/promotion-info/${id}/promotions/sorted-by-price`
      : `/api/promotion-info/${id}/promotions`;
    
    console.log('Fetching promotions from:', promotionUrl); // 調試信息
    
    fetch(promotionUrl)
      .then(res => {
        console.log('Promotion response status:', res.status); // 調試信息
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(async (promos) => {
        console.log('Promotions received:', promos); // 調試信息
        setPromotionList(promos);
        const user = authService.getCurrentUser();
        const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
        const likeStatusObj = {};
        const likeCountObj = {};
        const dislikeStatusObj = {};
        const dislikeCountObj = {};
        await Promise.all(promos.map(async (promo) => {
          try {
            const countRes = await axios.get(`/promotion-likes/${promo.id}/count`);
            likeCountObj[`promo-${promo.id}`] = countRes.data.count;
          } catch {
            likeCountObj[`promo-${promo.id}`] = promo.reportCount || 0;
          }
          try {
            const countRes = await axios.get(`/promotion-dislikes/${promo.id}/count`);
            dislikeCountObj[`promo-${promo.id}`] = countRes.data.count;
          } catch {
            dislikeCountObj[`promo-${promo.id}`] = 0;
          }
          if (user) {
            try {
              const res = await axios.get(`/promotion-likes/${promo.id}/has-liked`, { headers });
              likeStatusObj[`promo-${promo.id}`] = res.data.hasLiked;
            } catch {
              likeStatusObj[`promo-${promo.id}`] = false;
            }
            try {
              const res = await axios.get(`/promotion-dislikes/${promo.id}/has-disliked`, { headers });
              dislikeStatusObj[`promo-${promo.id}`] = res.data.hasDisliked;
            } catch {
              dislikeStatusObj[`promo-${promo.id}`] = false;
            }
          } else {
            likeStatusObj[`promo-${promo.id}`] = false;
            dislikeStatusObj[`promo-${promo.id}`] = false;
          }
        }));
        // 清空之前的優惠相關狀態，只保留價格相關狀態
        setLikeStatus(prev => {
          const newState = {};
          Object.keys(prev).forEach(key => {
            if (key.startsWith('price-')) {
              newState[key] = prev[key];
            }
          });
          return { ...newState, ...likeStatusObj };
        });
        setLikeCount(prev => {
          const newState = {};
          Object.keys(prev).forEach(key => {
            if (key.startsWith('price-')) {
              newState[key] = prev[key];
            }
          });
          return { ...newState, ...likeCountObj };
        });
        setDislikeStatus(prev => {
          const newState = {};
          Object.keys(prev).forEach(key => {
            if (key.startsWith('price-')) {
              newState[key] = prev[key];
            }
          });
          return { ...newState, ...dislikeStatusObj };
        });
        setDislikeCount(prev => {
          const newState = {};
          Object.keys(prev).forEach(key => {
            if (key.startsWith('price-')) {
              newState[key] = prev[key];
            }
          });
          return { ...newState, ...dislikeCountObj };
        });
      })
      .catch((error) => {
        console.error('Error fetching promotions:', error); // 調試信息
        alert('載入優惠資訊失敗: ' + error.message);
        setPromotionList([]);
      });
  }, [id, sortBy]);

  const handleAddPromotion = () => {
    if (!authService.getCurrentUser()) {
      alert('請先登入');
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    navigate(`/add-promotion/${id}`);
  };

  const handleLike = async (itemId, type) => {
    const user = authService.getCurrentUser();
    if (!user) {
      alert('請先登入');
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    const headers = { Authorization: `Bearer ${user.token}` };
    const key = `${type}-${itemId}`;
    
    const prevState = {
        likeStatus: { ...likeStatus },
        dislikeStatus: { ...dislikeStatus },
        likeCount: { ...likeCount },
        dislikeCount: { ...dislikeCount },
    };

    const isLiked = prevState.likeStatus[key];
    const isDisliked = prevState.dislikeStatus[key];

    if (isLiked) {
        setLikeStatus(prev => ({ ...prev, [key]: false }));
        setLikeCount(prev => ({ ...prev, [key]: (prev[key] || 1) - 1 }));
    } else {
        setLikeStatus(prev => ({ ...prev, [key]: true }));
        setLikeCount(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
        if (isDisliked) {
            setDislikeStatus(prev => ({ ...prev, [key]: false }));
            setDislikeCount(prev => ({ ...prev, [key]: (prev[key] || 1) - 1 }));
        }
    }

    try {
        if (isLiked) {
            await axios.post(`/${type}-likes/${itemId}/unlike`, {}, { headers });
        } else {
            if (isDisliked) {
                await axios.post(`/${type}-dislikes/${itemId}/undislike`, {}, { headers });
            }
            await axios.post(`/${type}-likes/${itemId}/like`, {}, { headers });
        }
    } catch (error) {
        console.error('Error updating like status:', error);
        alert('操作失敗，正在還原狀態...');
        setLikeStatus(prevState.likeStatus);
        setDislikeStatus(prevState.dislikeStatus);
        setLikeCount(prevState.likeCount);
        setDislikeCount(prevState.dislikeCount);
    }
  };

  const handleDislike = async (itemId, type) => {
    const user = authService.getCurrentUser();
    if (!user) {
      alert('請先登入');
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    const headers = { Authorization: `Bearer ${user.token}` };
    const key = `${type}-${itemId}`;

    const prevState = {
        likeStatus: { ...likeStatus },
        dislikeStatus: { ...dislikeStatus },
        likeCount: { ...likeCount },
        dislikeCount: { ...dislikeCount },
    };

    const isLiked = prevState.likeStatus[key];
    const isDisliked = prevState.dislikeStatus[key];

    if (isDisliked) {
        setDislikeStatus(prev => ({ ...prev, [key]: false }));
        setDislikeCount(prev => ({ ...prev, [key]: (prev[key] || 1) - 1 }));
    } else {
        setDislikeStatus(prev => ({ ...prev, [key]: true }));
        setDislikeCount(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
        if (isLiked) {
            setLikeStatus(prev => ({ ...prev, [key]: false }));
            setLikeCount(prev => ({ ...prev, [key]: (prev[key] || 1) - 1 }));
        }
    }

    try {
        if (isDisliked) {
            await axios.post(`/${type}-dislikes/${itemId}/undislike`, {}, { headers });
        } else {
            if (isLiked) {
                await axios.post(`/${type}-likes/${itemId}/unlike`, {}, { headers });
            }
            await axios.post(`/${type}-dislikes/${itemId}/dislike`, {}, { headers });
        }
    } catch (error) {
        console.error('Error updating dislike status:', error);
        alert('操作失敗，正在還原狀態...');
        setLikeStatus(prevState.likeStatus);
        setDislikeStatus(prevState.dislikeStatus);
        setLikeCount(prevState.likeCount);
        setDislikeCount(prevState.dislikeCount);
    }
  };

  const handleDislikeClick = (itemId, type) => {
    setCurrentDislikeId(itemId);
    setCurrentDislikeType(type);
    setOpenDislikeDialog(true);
  };

  const handleSimpleDislike = async () => {
    if (currentDislikeId && currentDislikeType) {
      await handleDislike(currentDislikeId, currentDislikeType);
    }
    setOpenDislikeDialog(false);
  };

  const handleReportError = () => {
    if (!currentDislikeId || !currentDislikeType) return;

    const reportUrl = `/report-error/${currentDislikeType}/${currentDislikeId}`;
    setOpenDislikeDialog(false);
    navigate(reportUrl);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-4">
        {/* 商品資訊 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-6">
            <img
              src={product.imageUrl || 'https://dummyimage.com/200x200/cccccc/ffffff&text=No+Image'}
              alt={product.name}
              className="w-32 h-32 object-cover rounded-xl"
              onError={e => {
                if (!e.target.dataset.fallback) {
                  e.target.src = 'https://dummyimage.com/200x200/cccccc/ffffff&text=No+Image';
                  e.target.dataset.fallback = '1';
                }
              }}
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-gray-600 text-lg mb-4">{product.description}</p>
              <div className="flex items-center space-x-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  商品編號: {product.id}
                </span>
                {product.barcode && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    條碼: {product.barcode}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 控制面板 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* 左側：檢視模式切換 */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 font-medium">檢視模式:</span>
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  view === 'grid' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <FaTh className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  view === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <FaList className="h-4 w-4" />
              </button>
            </div>

            {/* 右側：排序按鈕 */}
            <div className="flex items-center space-x-4">
              {/* 排序 */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 font-medium">排序:</span>
                <button
                  onClick={() => setSortBy(prev => prev === 'report' ? 'price' : 'report')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    sortBy === 'price'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {sortBy === 'price' ? '按價格排序' : '按回報數排序'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 優惠資訊區塊 */}
        {promotionList.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaFire className="h-6 w-6 text-orange-500 mr-3" />
                優惠資訊
              </h2>
              <button
                onClick={handleAddPromotion}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <FaPlus className="h-4 w-4" />
                分享優惠
              </button>
            </div>

            {view === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotionList.map((promo, index) => (
                  <div key={promo.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 fade-in relative" style={{animationDelay: `${index * 0.1}s`}}>
                    {/* 優惠類型標籤 */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        promo.type === 'DISCOUNT' ? 'bg-blue-100 text-blue-800' :
                        promo.type === 'SPECIAL' ? 'bg-red-100 text-red-800' :
                        promo.type === 'BUY_ONE_GET_ONE' ? 'bg-green-100 text-green-800' :
                        promo.type === 'COUPON' ? 'bg-yellow-100 text-yellow-800' :
                        promo.type === 'LIMITED_TIME' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {promo.type === 'DISCOUNT' ? 
                          (promo.discountValue ? `${promo.discountValue}折` : '打折') :
                         promo.type === 'SPECIAL' ? '特價' :
                         promo.type === 'BUY_ONE_GET_ONE' ? '買一送一' :
                         promo.type === 'COUPON' ? '折價券' :
                         promo.type === 'LIMITED_TIME' ? '限時搶購' :
                         promo.type}
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

                      {/* 互動按鈕 */}
                      <div className="flex gap-2 mb-3">
                        <button
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            likeStatus[`promo-${promo.id}`] 
                              ? 'bg-gray-500 text-white' 
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                          onClick={() => handleLike(promo.id, 'promotion')}
                        >
                          <FaThumbsUp className="inline h-3 w-3 mr-1" />
                          {likeStatus[`promo-${promo.id}`] ? '已按讚' : '按讚'}
                        </button>
                        <button
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            dislikeStatus[`promo-${promo.id}`] 
                              ? 'bg-gray-500 text-white' 
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                          onClick={() => {
                            const key = `promo-${promo.id}`;
                            if (!dislikeStatus[key]) {
                              handleDislikeClick(promo.id, 'promotion');
                            } else {
                              handleDislike(promo.id, 'promotion');
                            }
                          }}
                        >
                          <FaThumbsDown className="inline h-3 w-3 mr-1" />
                          {dislikeStatus[`promo-${promo.id}`] ? '已倒讚' : '倒讚'}
                        </button>
                      </div>

                      {/* 統計資訊 */}
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>👍 {likeCount[`promo-${promo.id}`] ?? promo.reportCount ?? 0} 人回報</span>
                        <span>👎 {dislikeCount[`promo-${promo.id}`] ?? 0} 人倒讚</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {promotionList.map((promo, index) => (
                  <div key={promo.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 fade-in flex items-center p-6 relative" style={{animationDelay: `${0.2 + index * 0.1}s`}}>
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
                        <span className={`px-4 py-2 rounded-full text-base font-medium ${
                          promo.type === 'DISCOUNT' ? 'bg-blue-100 text-blue-800' :
                          promo.type === 'SPECIAL' ? 'bg-red-100 text-red-800' :
                          promo.type === 'BUY_ONE_GET_ONE' ? 'bg-green-100 text-green-800' :
                          promo.type === 'COUPON' ? 'bg-yellow-100 text-yellow-800' :
                          promo.type === 'LIMITED_TIME' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {promo.type === 'DISCOUNT' ? 
                            (promo.discountValue ? `${promo.discountValue}折` : '打折') :
                           promo.type === 'SPECIAL' ? '特價' :
                           promo.type === 'BUY_ONE_GET_ONE' ? '買一送一' :
                           promo.type === 'COUPON' ? '折價券' :
                           promo.type === 'LIMITED_TIME' ? '限時搶購' :
                           promo.type}
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
                      {/* 互動按鈕 */}
                      <div className="flex gap-2">
                        <button
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            likeStatus[`promo-${promo.id}`] 
                              ? 'bg-gray-500 text-white' 
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                          onClick={() => handleLike(promo.id, 'promotion')}
                        >
                          <FaThumbsUp className="inline h-3 w-3 mr-1" />
                          {likeStatus[`promo-${promo.id}`] ? '已按讚' : '按讚'}
                        </button>
                        <button
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            dislikeStatus[`promo-${promo.id}`] 
                              ? 'bg-gray-500 text-white' 
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                          onClick={() => {
                            const key = `promo-${promo.id}`;
                            if (!dislikeStatus[key]) {
                              handleDislikeClick(promo.id, 'promotion');
                            } else {
                              handleDislike(promo.id, 'promotion');
                            }
                          }}
                        >
                          <FaThumbsDown className="inline h-3 w-3 mr-1" />
                          {dislikeStatus[`promo-${promo.id}`] ? '已倒讚' : '倒讚'}
                        </button>
                      </div>

                      {/* 統計資訊 */}
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>👍 {likeCount[`promo-${promo.id}`] ?? promo.reportCount ?? 0} 人回報</span>
                        <span>👎 {dislikeCount[`promo-${promo.id}`] ?? 0} 人倒讚</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 商店價格區塊 */}
        {priceList.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaStore className="h-6 w-6 text-blue-500 mr-3" />
                商店價格
              </h2>
            </div>

            {view === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {priceList.map((price, index) => (
                  <div key={price.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 fade-in" style={{animationDelay: `${0.4 + index * 0.1}s`}}>
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

                      {/* 互動按鈕 */}
                      <div className="flex gap-2 mb-3">
                        <button
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            likeStatus[`price-${price.id}`] 
                              ? 'bg-gray-500 text-white' 
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                          onClick={() => handleLike(price.id, 'price')}
                        >
                          <FaThumbsUp className="inline h-3 w-3 mr-1" />
                          {likeStatus[`price-${price.id}`] ? '已按讚' : '按讚'}
                        </button>
                        <button
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            dislikeStatus[`price-${price.id}`] 
                              ? 'bg-gray-500 text-white' 
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                          onClick={() => {
                            const key = `price-${price.id}`;
                            if (!dislikeStatus[key]) {
                              handleDislikeClick(price.id, 'price');
                            } else {
                              handleDislike(price.id, 'price');
                            }
                          }}
                        >
                          <FaThumbsDown className="inline h-3 w-3 mr-1" />
                          {dislikeStatus[`price-${price.id}`] ? '已倒讚' : '倒讚'}
                        </button>
                      </div>

                      {/* 統計資訊 */}
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>👍 {likeCount[`price-${price.id}`] ?? price.reportCount ?? 0} 人回報</span>
                        <span>👎 {dislikeCount[`price-${price.id}`] ?? 0} 人倒讚</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {priceList.map((price, index) => (
                  <div key={price.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 fade-in flex items-center p-6" style={{animationDelay: `${0.4 + index * 0.1}s`}}>
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
                      {/* 互動按鈕 */}
                      <div className="flex gap-2">
                        <button
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            likeStatus[`price-${price.id}`] 
                              ? 'bg-gray-500 text-white' 
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                          onClick={() => handleLike(price.id, 'price')}
                        >
                          <FaThumbsUp className="inline h-3 w-3 mr-1" />
                          {likeStatus[`price-${price.id}`] ? '已按讚' : '按讚'}
                        </button>
                        <button
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            dislikeStatus[`price-${price.id}`] 
                              ? 'bg-gray-500 text-white' 
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                          onClick={() => {
                            const key = `price-${price.id}`;
                            if (!dislikeStatus[key]) {
                              handleDislikeClick(price.id, 'price');
                            } else {
                              handleDislike(price.id, 'price');
                            }
                          }}
                        >
                          <FaThumbsDown className="inline h-3 w-3 mr-1" />
                          {dislikeStatus[`price-${price.id}`] ? '已倒讚' : '倒讚'}
                        </button>
                      </div>

                      {/* 統計資訊 */}
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>👍 {likeCount[`price-${price.id}`] ?? price.reportCount ?? 0} 人回報</span>
                        <span>👎 {dislikeCount[`price-${price.id}`] ?? 0} 人倒讚</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 沒有資料時的提示 */}
        {promotionList.length === 0 && priceList.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaStore className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">尚無價格資訊</h3>
            <p className="text-gray-600 mb-6">目前還沒有商店提供此商品的價格資訊</p>
            <button
              onClick={handleAddPromotion}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
            >
              <FaPlus className="h-4 w-4" />
              分享優惠資訊
            </button>
          </div>
        )}
      </div>

      {/* Dialog for dislike reason */}
      <Dialog open={openDislikeDialog} onClose={() => setOpenDislikeDialog(false)}>
        <DialogTitle>請選擇倒讚原因</DialogTitle>
        <DialogActions>
          <Button onClick={handleSimpleDislike}>單純不喜歡</Button>
          <Button onClick={handleReportError} color="error">回報錯誤</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Compare;