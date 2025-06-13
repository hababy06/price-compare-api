import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const Compare = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [priceList, setPriceList] = useState([]);
  const [promotionList, setPromotionList] = useState([]);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(setProduct)
      .catch(() => alert('載入商品失敗'));

    fetch(`/api/price-info/${id}/prices`)
      .then(res => res.json())
      .then(setPriceList)
      .catch(() => setPriceList([]));

    fetch(`/api/promotion-info/${id}/promotions`)
      .then(res => res.json())
      .then(setPromotionList)
      .catch(() => setPromotionList([]));
  }, [id]);

  if (!product) return <p className="p-6">載入中...</p>;

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-gray-600 hover:text-gray-900"
        title="返回主頁"
      >
        <FaHome size={24} />
      </button>
      <h1 className="text-2xl font-bold">📊 {product.name} - 比價與優惠</h1>

      <div>
        <button
          className="bg-black text-white px-4 py-2 rounded mr-2"
          onClick={() => navigate(`/add-promotion/${id}`)}
        >
          ➕ 新增優惠
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
                    <p className="font-bold">商家：{promo.storeName}</p>
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
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      👍 {promo.reportCount} 人回報
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
              <p>商家：{price.storeName}</p>
              <p>價格：${price.price}</p>
              <p>👍 {price.reportCount}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Compare;
