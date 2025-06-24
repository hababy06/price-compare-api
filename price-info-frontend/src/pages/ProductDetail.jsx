import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { authService } from '../services/authService';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null));
  }, [id]);

  const handleAddPromotion = () => {
    if (!authService.getCurrentUser()) {
      alert('請先登入');
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    navigate(`/add-promotion/${product.id}`);
  };

  if (!product) return <p className="p-6">載入中...</p>;

  const productImage = product.imageUrl || 'https://dummyimage.com/300x300/cccccc/ffffff&text=No+Image';

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col items-center mb-4">
        <img src={productImage} alt={product.name} style={{height:96, width:96, objectFit:'cover', borderRadius:16}} onError={e => e.target.src='https://dummyimage.com/300x300/cccccc/ffffff&text=No+Image'} />
      </div>
      
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
          onClick={handleAddPromotion}
        >
          ➕ 分享優惠
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
