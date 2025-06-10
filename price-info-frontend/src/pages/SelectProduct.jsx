// src/pages/Select.jsx（或你對應的路徑）
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
              className="border p-3 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-gray-500">條碼：{product.barcode}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
