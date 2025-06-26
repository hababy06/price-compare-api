import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaStore, FaFire, FaDollarSign, FaThumbsUp, FaThumbsDown, FaPlus, FaExclamationTriangle, FaClock, FaList, FaTh } from 'react-icons/fa';
import { authService } from "../services/authService";
import axios from "axios";
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import { useLikeDislike } from '../hooks/useLikeDislike';
import ControlPanel from '../components/ControlPanel';
import PriceCard from '../components/PriceCard';
import PromotionCard from '../components/PromotionCard';

const Compare = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [priceList, setPriceList] = useState([]);
  const [promotionList, setPromotionList] = useState([]);
  const [openDislikeDialog, setOpenDislikeDialog] = useState(false);
  const [currentDislikeId, setCurrentDislikeId] = useState(null);
  const [currentDislikeType, setCurrentDislikeType] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('price'); // 'report' or 'price'

  // 使用自定義 Hook 處理按讚/倒讚邏輯
  const {
    likeStatus,
    setLikeStatus,
    likeCount,
    setLikeCount,
    dislikeStatus,
    setDislikeStatus,
    dislikeCount,
    setDislikeCount,
    handleLike,
    handleDislike
  } = useLikeDislike();

  useEffect(() => {
    axios.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch((error) => {
        console.error('載入商品失敗:', error);
        alert('載入商品失敗: ' + error.message);
      });

    // 根據排序方式獲取價格資料
    const priceUrl = sortBy === 'price' 
      ? `/price-info/${id}/prices/sorted-by-price`
      : `/price-info/${id}/prices`;
    
    axios.get(priceUrl)
      .then(async (res) => {
        const prices = res.data;
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
          } catch (error) {
            console.error(`載入價格 ${price.id} 按讚數失敗:`, error);
            likeCountObj[`price-${price.id}`] = price.reportCount || 0;
          }
          try {
            const countRes = await axios.get(`/price-dislikes/${price.id}/count`);
            dislikeCountObj[`price-${price.id}`] = countRes.data.count;
          } catch (error) {
            console.error(`載入價格 ${price.id} 倒讚數失敗:`, error);
            dislikeCountObj[`price-${price.id}`] = 0;
          }
          if (user) {
            try {
              const res = await axios.get(`/price-likes/${price.id}/has-liked`, { headers });
              likeStatusObj[`price-${price.id}`] = res.data.hasLiked;
            } catch (error) {
              console.error(`檢查價格 ${price.id} 按讚狀態失敗:`, error);
              likeStatusObj[`price-${price.id}`] = false;
            }
            try {
              const res = await axios.get(`/price-dislikes/${price.id}/has-disliked`, { headers });
              dislikeStatusObj[`price-${price.id}`] = res.data.hasDisliked;
            } catch (error) {
              console.error(`檢查價格 ${price.id} 倒讚狀態失敗:`, error);
              dislikeStatusObj[`price-${price.id}`] = false;
            }
          } else {
            likeStatusObj[`price-${price.id}`] = false;
            dislikeStatusObj[`price-${price.id}`] = false;
          }
        }));
        
        // 更新狀態，保留優惠相關狀態
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
        console.error('載入價格資訊失敗:', error);
        alert('載入價格資訊失敗: ' + error.message);
        setPriceList([]);
      });

    // 根據排序方式獲取優惠資料
    const promotionUrl = sortBy === 'price'
      ? `/promotion-info/${id}/promotions/sorted-by-price`
      : `/promotion-info/${id}/promotions`;
    
    axios.get(promotionUrl)
      .then(async (res) => {
        const promos = res.data;
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
            likeCountObj[`promotion-${promo.id}`] = countRes.data.count;
          } catch (error) {
            console.error(`載入優惠 ${promo.id} 按讚數失敗:`, error);
            likeCountObj[`promotion-${promo.id}`] = promo.reportCount || 0;
          }
          try {
            const countRes = await axios.get(`/promotion-dislikes/${promo.id}/count`);
            dislikeCountObj[`promotion-${promo.id}`] = countRes.data.count;
          } catch (error) {
            console.error(`載入優惠 ${promo.id} 倒讚數失敗:`, error);
            dislikeCountObj[`promotion-${promo.id}`] = 0;
          }
          if (user) {
            try {
              const res = await axios.get(`/promotion-likes/${promo.id}/has-liked`, { headers });
              likeStatusObj[`promotion-${promo.id}`] = res.data.hasLiked;
            } catch (error) {
              console.error(`檢查優惠 ${promo.id} 按讚狀態失敗:`, error);
              likeStatusObj[`promotion-${promo.id}`] = false;
            }
            try {
              const res = await axios.get(`/promotion-dislikes/${promo.id}/has-disliked`, { headers });
              dislikeStatusObj[`promotion-${promo.id}`] = res.data.hasDisliked;
            } catch (error) {
              console.error(`檢查優惠 ${promo.id} 倒讚狀態失敗:`, error);
              dislikeStatusObj[`promotion-${promo.id}`] = false;
            }
          } else {
            likeStatusObj[`promotion-${promo.id}`] = false;
            dislikeStatusObj[`promotion-${promo.id}`] = false;
          }
        }));
        
        // 更新狀態，保留價格相關狀態
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
        console.error('載入優惠資訊失敗:', error);
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
        <ControlPanel 
          view={view} 
          setView={setView} 
          sortBy={sortBy} 
          setSortBy={setSortBy} 
        />

        {/* 優惠資訊區塊 */}
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

          {promotionList.length > 0 ? (
            view === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotionList.map((promo, index) => (
                  <PromotionCard
                    key={promo.id}
                    promo={promo}
                    index={index}
                    view={view}
                    likeStatus={likeStatus}
                    dislikeStatus={dislikeStatus}
                    likeCount={likeCount}
                    dislikeCount={dislikeCount}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onDislikeClick={handleDislikeClick}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {promotionList.map((promo, index) => (
                  <PromotionCard
                    key={promo.id}
                    promo={promo}
                    index={index}
                    view={view}
                    likeStatus={likeStatus}
                    dislikeStatus={dislikeStatus}
                    likeCount={likeCount}
                    dislikeCount={dislikeCount}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onDislikeClick={handleDislikeClick}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="text-gray-500 text-center py-8">目前尚無優惠，歡迎成為第一個分享優惠的人！</div>
          )}
        </div>

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
                  <PriceCard
                    key={price.id}
                    price={price}
                    index={index}
                    view={view}
                    likeStatus={likeStatus}
                    dislikeStatus={dislikeStatus}
                    likeCount={likeCount}
                    dislikeCount={dislikeCount}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onDislikeClick={handleDislikeClick}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {priceList.map((price, index) => (
                  <PriceCard
                    key={price.id}
                    price={price}
                    index={index}
                    view={view}
                    likeStatus={likeStatus}
                    dislikeStatus={dislikeStatus}
                    likeCount={likeCount}
                    dislikeCount={dislikeCount}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onDislikeClick={handleDislikeClick}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 倒讚 Dialog */}
      <Dialog open={openDislikeDialog} onClose={() => setOpenDislikeDialog(false)}>
          <DialogTitle>選擇倒讚原因</DialogTitle>
        <DialogActions>
          <Button onClick={handleSimpleDislike}>單純不喜歡</Button>
            <Button onClick={handleReportError}>回報錯誤</Button>
            <Button onClick={() => setOpenDislikeDialog(false)}>取消</Button>
        </DialogActions>
      </Dialog>
      </div>
    </div>
  );
};

export default Compare;

