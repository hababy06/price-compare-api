import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Compare = () => {
  const { id } = useParams();
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
      <h1 className="text-2xl font-bold">📊 {product.name} - 比價與優惠</h1>

      {promotionList.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-4">🔥 優惠資訊</h2>
          <ul className="space-y-2">
            {promotionList.map(promo => (
              <li key={promo.id} className="border p-3 rounded bg-yellow-50">
                <p>商家：{promo.storeName}</p>
                <p>
                  優惠：{promo.type === 'DISCOUNT'
                    ? `${promo.discountValue} 折`
                    : `特價 ${promo.finalPrice} 元`}
                </p>
                <p>備註：{promo.remark || '—'}</p>
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
