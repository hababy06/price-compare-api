import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import { authService } from "../services/authService";
import axios from "axios";

const Compare = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [priceList, setPriceList] = useState([]);
  const [promotionList, setPromotionList] = useState([]);
  const [likeStatus, setLikeStatus] = useState({}); // {promotionId: true/false}
  const [likeCount, setLikeCount] = useState({}); // {promotionId: 數量}
  const [dislikeStatus, setDislikeStatus] = useState({});
  const [dislikeCount, setDislikeCount] = useState({});

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(setProduct)
      .catch(() => alert('載入商品失敗'));

    fetch(`/api/price-info/${id}/prices`)
      .then(res => res.json())
      .then(async (prices) => {
        setPriceList(prices);
        const user = authService.getCurrentUser();
        const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
        const likeStatusObj = {};
        const likeCountObj = {};
        const dislikeStatusObj = {};
        const dislikeCountObj = {};
        await Promise.all(prices.map(async (price) => {
          // like count
          try {
            const countRes = await axios.get(`/api/price-likes/${price.id}/count`);
            likeCountObj[`price-${price.id}`] = countRes.data.count;
          } catch {
            likeCountObj[`price-${price.id}`] = price.reportCount || 0;
          }
          // dislike count
          try {
            const countRes = await axios.get(`/api/price-dislikes/${price.id}/count`);
            dislikeCountObj[`price-${price.id}`] = countRes.data.count;
          } catch {
            dislikeCountObj[`price-${price.id}`] = 0;
          }
          // like status
          if (user) {
            try {
              const res = await axios.get(`/api/price-likes/${price.id}/has-liked`, { headers });
              likeStatusObj[`price-${price.id}`] = res.data.hasLiked;
            } catch {
              likeStatusObj[`price-${price.id}`] = false;
            }
            try {
              const res = await axios.get(`/api/price-dislikes/${price.id}/has-disliked`, { headers });
              dislikeStatusObj[`price-${price.id}`] = res.data.hasDisliked;
            } catch {
              dislikeStatusObj[`price-${price.id}`] = false;
            }
          } else {
            likeStatusObj[`price-${price.id}`] = false;
            dislikeStatusObj[`price-${price.id}`] = false;
          }
        }));
        setLikeStatus(prev => ({ ...prev, ...likeStatusObj }));
        setLikeCount(prev => ({ ...prev, ...likeCountObj }));
        setDislikeStatus(prev => ({ ...prev, ...dislikeStatusObj }));
        setDislikeCount(prev => ({ ...prev, ...dislikeCountObj }));
      })
      .catch(() => setPriceList([]));

    fetch(`/api/promotion-info/${id}/promotions`)
      .then(res => res.json())
      .then(async (promos) => {
        setPromotionList(promos);
        const user = authService.getCurrentUser();
        const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
        const likeStatusObj = {};
        const likeCountObj = {};
        const dislikeStatusObj = {};
        const dislikeCountObj = {};
        await Promise.all(promos.map(async (promo) => {
          // like count
          try {
            const countRes = await axios.get(`/api/promotion-likes/${promo.id}/count`);
            likeCountObj[`promo-${promo.id}`] = countRes.data.count;
          } catch {
            likeCountObj[`promo-${promo.id}`] = promo.reportCount || 0;
          }
          // dislike count
          try {
            const countRes = await axios.get(`/api/promotion-dislikes/${promo.id}/count`);
            dislikeCountObj[`promo-${promo.id}`] = countRes.data.count;
          } catch {
            dislikeCountObj[`promo-${promo.id}`] = 0;
          }
          // like status
          if (user) {
            try {
              const res = await axios.get(`/api/promotion-likes/${promo.id}/has-liked`, { headers });
              likeStatusObj[`promo-${promo.id}`] = res.data.hasLiked;
            } catch {
              likeStatusObj[`promo-${promo.id}`] = false;
            }
            try {
              const res = await axios.get(`/api/promotion-dislikes/${promo.id}/has-disliked`, { headers });
              dislikeStatusObj[`promo-${promo.id}`] = res.data.hasDisliked;
            } catch {
              dislikeStatusObj[`promo-${promo.id}`] = false;
            }
          } else {
            likeStatusObj[`promo-${promo.id}`] = false;
            dislikeStatusObj[`promo-${promo.id}`] = false;
          }
        }));
        setLikeStatus(prev => ({ ...prev, ...likeStatusObj }));
        setLikeCount(prev => ({ ...prev, ...likeCountObj }));
        setDislikeStatus(prev => ({ ...prev, ...dislikeStatusObj }));
        setDislikeCount(prev => ({ ...prev, ...dislikeCountObj }));
      })
      .catch(() => setPromotionList([]));
  }, [id]);

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
    try {
      if (type === 'promotion') {
        const promoKey = `promo-${itemId}`;
        // 先取消倒讚
        if (dislikeStatus[promoKey]) await axios.post(`/api/promotion-dislikes/${itemId}/undislike`, {}, { headers });
        if (!likeStatus[promoKey]) {
          const res = await axios.post(`/api/promotion-likes/${itemId}`, {}, { headers });
          if (res.data.liked) {
            setLikeStatus(prev => ({ ...prev, [promoKey]: true }));
            setLikeCount(prev => ({ ...prev, [promoKey]: (prev[promoKey] || 0) + 1 }));
            setDislikeStatus(prev => ({ ...prev, [promoKey]: false }));
            setDislikeCount(prev => ({ ...prev, [promoKey]: Math.max((prev[promoKey] || 1) - 1, 0) }));
          }
        } else {
          const res = await axios.delete(`/api/promotion-likes/${itemId}`, { headers });
          if (res.data.unliked) {
            setLikeStatus(prev => ({ ...prev, [promoKey]: false }));
            setLikeCount(prev => ({ ...prev, [promoKey]: Math.max((prev[promoKey] || 1) - 1, 0) }));
          }
        }
      } else if (type === 'price') {
        const priceKey = `price-${itemId}`;
        // 先取消倒讚
        if (dislikeStatus[priceKey]) await axios.post(`/api/price-dislikes/${itemId}/undislike`, {}, { headers });
        if (!likeStatus[priceKey]) {
          const res = await axios.post(`/api/price-likes/${itemId}`, {}, { headers });
          if (res.data.liked) {
            setLikeStatus(prev => ({ ...prev, [priceKey]: true }));
            setLikeCount(prev => ({ ...prev, [priceKey]: (prev[priceKey] || 0) + 1 }));
            setDislikeStatus(prev => ({ ...prev, [priceKey]: false }));
            setDislikeCount(prev => ({ ...prev, [priceKey]: Math.max((prev[priceKey] || 1) - 1, 0) }));
          }
        } else {
          const res = await axios.delete(`/api/price-likes/${itemId}`, { headers });
          if (res.data.unliked) {
            setLikeStatus(prev => ({ ...prev, [priceKey]: false }));
            setLikeCount(prev => ({ ...prev, [priceKey]: Math.max((prev[priceKey] || 1) - 1, 0) }));
          }
        }
      }
    } catch (err) {
      alert('操作失敗');
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
    try {
      if (type === 'price') {
        const priceKey = `price-${itemId}`;
        if (!dislikeStatus[priceKey]) {
          // 先取消 like
          if (likeStatus[priceKey]) await axios.delete(`/api/price-likes/${itemId}`, { headers });
          const res = await axios.post(`/api/price-dislikes/${itemId}`, {}, { headers });
          if (res.data.disliked) {
            setDislikeStatus(prev => ({ ...prev, [priceKey]: true }));
            setDislikeCount(prev => ({ ...prev, [priceKey]: (prev[priceKey] || 0) + 1 }));
            setLikeStatus(prev => ({ ...prev, [priceKey]: false }));
            setLikeCount(prev => ({ ...prev, [priceKey]: Math.max((prev[priceKey] || 1) - 1, 0) }));
          }
        } else {
          const res = await axios.post(`/api/price-dislikes/${itemId}/undislike`, {}, { headers });
          if (res.data.undisliked) {
            setDislikeStatus(prev => ({ ...prev, [priceKey]: false }));
            setDislikeCount(prev => ({ ...prev, [priceKey]: Math.max((prev[priceKey] || 1) - 1, 0) }));
          }
        }
      } else if (type === 'promotion') {
        const promoKey = `promo-${itemId}`;
        if (!dislikeStatus[promoKey]) {
          if (likeStatus[promoKey]) await axios.delete(`/api/promotion-likes/${itemId}`, { headers });
          const res = await axios.post(`/api/promotion-dislikes/${itemId}`, {}, { headers });
          if (res.data.disliked) {
            setDislikeStatus(prev => ({ ...prev, [promoKey]: true }));
            setDislikeCount(prev => ({ ...prev, [promoKey]: (prev[promoKey] || 0) + 1 }));
            setLikeStatus(prev => ({ ...prev, [promoKey]: false }));
            setLikeCount(prev => ({ ...prev, [promoKey]: Math.max((prev[promoKey] || 1) - 1, 0) }));
          }
        } else {
          const res = await axios.post(`/api/promotion-dislikes/${itemId}/undislike`, {}, { headers });
          if (res.data.undisliked) {
            setDislikeStatus(prev => ({ ...prev, [promoKey]: false }));
            setDislikeCount(prev => ({ ...prev, [promoKey]: Math.max((prev[promoKey] || 1) - 1, 0) }));
          }
        }
      }
    } catch (err) {
      alert('操作失敗');
    }
  };

  if (!product) return <p className="p-6">載入中...</p>;

  // 商品圖片與名稱
  const productImage = product.imageUrl || 'https://dummyimage.com/300x300/cccccc/ffffff&text=No+Image';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <img src={productImage} alt={product.name} style={{height:64, width:64, objectFit:'cover', borderRadius:12}} onError={e => e.target.src='https://dummyimage.com/300x300/cccccc/ffffff&text=No+Image'} />
        <h1 className="text-3xl font-bold">{product.name}</h1>
      </div>

      <div>
        <button
          className="bg-black text-white px-4 py-2 rounded mr-2"
          onClick={handleAddPromotion}
        >
          ➕ 分享優惠
        </button>
      </div>

      {promotionList.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-4">🔥 優惠資訊</h2>
          <ul className="space-y-2">
            {promotionList.map(promo => (
              <li key={promo.id} className="border p-3 rounded bg-yellow-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={promo.storeLogoUrl || 'https://dummyimage.com/64x64/cccccc/ffffff&text=No+Logo'}
                        alt={promo.storeName}
                        style={{height:32, width:32, objectFit:'cover', borderRadius:6}}
                        onError={e => {
                          if (!e.target.dataset.fallback) {
                            e.target.src = 'https://dummyimage.com/64x64/cccccc/ffffff&text=No+Logo';
                            e.target.dataset.fallback = '1';
                          }
                        }}
                      />
                      <p className="font-bold">商家：{promo.storeName}</p>
                    </div>
                    <p>
                      優惠：
                      {promo.type === 'DISCOUNT'
                        ? (
                            <>
                              {promo.discountValue} 折<br />
                              最終價: {promo.finalPrice} 元
                            </>
                          )
                        : `特價 ${promo.finalPrice} 元`}
                    </p>
                    <p>期間：{promo.startTime?.slice(0,10)} ～ {promo.endTime?.slice(0,10)}</p>
                    <p>備註：{promo.remark || '—'}</p>
                    <button
                      className={`mt-2 px-3 py-1 rounded ${likeStatus[`promo-${promo.id}`] ? 'bg-gray-400 text-white' : 'bg-blue-500 text-white'}`}
                      onClick={() => handleLike(promo.id, 'promotion')}
                    >
                      {likeStatus[`promo-${promo.id}`] ? '👍 已按讚（再按可取消）' : '👍 按讚'}
                    </button>
                    <button
                      className={`mt-2 px-3 py-1 rounded ml-2 ${dislikeStatus[`promo-${promo.id}`] ? 'bg-gray-400 text-white' : 'bg-red-500 text-white'}`}
                      onClick={() => handleDislike(promo.id, 'promotion')}
                    >
                      {dislikeStatus[`promo-${promo.id}`] ? '👎 已倒讚（再按可取消）' : '👎 倒讚'}
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      👍 {likeCount[`promo-${promo.id}`] ?? promo.reportCount ?? 0} 人回報
                    </p>
                    <p className="text-sm text-gray-600">
                      👎 {dislikeCount[`promo-${promo.id}`] ?? 0} 人倒讚
                    </p>
                    {promo.endTime && new Date(promo.endTime) < new Date() && (
                      <p className="text-sm text-red-600">已過期</p>
                    )}
                    {promo.endTime && 
                     new Date(promo.endTime) > new Date() && 
                     new Date(promo.endTime) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                      <p className="text-sm text-orange-600">即將結束</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mt-4">💰 商店價格</h2>
        <ul className="space-y-2">
          {priceList.map(price => (
            <li key={price.id} className="border p-3 rounded">
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={price.storeLogoUrl || 'https://dummyimage.com/64x64/cccccc/ffffff&text=No+Logo'}
                  alt={price.storeName}
                  style={{height:32, width:32, objectFit:'cover', borderRadius:6}}
                  onError={e => {
                    if (!e.target.dataset.fallback) {
                      e.target.src = 'https://dummyimage.com/64x64/cccccc/ffffff&text=No+Logo';
                      e.target.dataset.fallback = '1';
                    }
                  }}
                />
                <p>商家：{price.storeName}</p>
              </div>
              <p>價格：${price.price}</p>
              <p style={{color: 'orange'}}>DEBUG: likeStatus[price-{price.id}] = {String(likeStatus[`price-${price.id}`])}</p>
              <button
                className={`mt-2 px-3 py-1 rounded ${likeStatus[`price-${price.id}`] ? 'bg-gray-400 text-white' : 'bg-blue-500 text-white'}`}
                onClick={() => handleLike(price.id, 'price')}
              >
                {likeStatus[`price-${price.id}`] ? '👍 已按讚（再按可取消）' : '👍 按讚'}
              </button>
              <button
                className={`mt-2 px-3 py-1 rounded ml-2 ${dislikeStatus[`price-${price.id}`] ? 'bg-gray-400 text-white' : 'bg-red-500 text-white'}`}
                onClick={() => handleDislike(price.id, 'price')}
              >
                {dislikeStatus[`price-${price.id}`] ? '👎 已倒讚（再按可取消）' : '👎 倒讚'}
              </button>
              <p className="text-sm text-gray-600">
                👍 {likeCount[`price-${price.id}`] ?? price.reportCount ?? 0} 人回報
              </p>
              <p className="text-sm text-gray-600">
                👎 {dislikeCount[`price-${price.id}`] ?? 0} 人倒讚
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Compare;
