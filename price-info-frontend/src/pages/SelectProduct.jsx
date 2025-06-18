// src/pages/Select.jsx（或你對應的路徑）
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const Select = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const products = location.state?.products || [];

  return (
    <div className="p-6">
    
      <h1 className="text-2xl font-bold mb-4">請選擇正確商品</h1>
      {products.length === 0 ? (
        <p>沒有收到任何商品資料</p>
      ) : (
        <ul className="space-y-2">
          {products.map((product) => (
            <li
              key={product.id}
              className="border p-3 rounded cursor-pointer hover:bg-gray-100 flex items-center gap-4"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img src={product.imageUrl || 'https://dummyimage.com/300x300/cccccc/ffffff&text=No+Image'} alt={product.name} style={{height:48, width:48, objectFit:'cover', borderRadius:8}} onError={e => e.target.src='https://dummyimage.com/300x300/cccccc/ffffff&text=No+Image'} />
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-500">條碼：{product.barcode}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
