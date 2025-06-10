import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => {
        console.error('載入商品失敗', err);
        alert('載入失敗，請稍後再試');
      });
  }, [id]);

  if (!product) return <p className="p-6">載入中...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold">{product.name}</h1>

      <div className="flex gap-4">
        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={() => navigate(`/compare/${product.id}`)}
        >
          📊 比價
        </button>

        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={() => navigate(`/add-promotion/${product.id}`)}
        >
          ➕ 新增優惠
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
