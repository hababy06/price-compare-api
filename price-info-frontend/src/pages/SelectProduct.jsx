// src/pages/Select.jsx（或你對應的路徑）
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaList, FaTh, FaChevronRight } from 'react-icons/fa';

/**
 * 網格檢視的商品卡片組件 - 【關鍵修正：使其更緊湊】
 */
const GridProductItem = ({ product, index, navigate }) => (
  <div
    className="flex flex-col bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group fade-in h-full"
    style={{ animationDelay: `${index * 0.05}s` }}
    onClick={() => navigate(`/product/${product.id}`)}
  >
    <div className="relative overflow-hidden rounded-t-lg aspect-square bg-gray-100 w-full">
      <img
        src={product.imageUrl || 'https://dummyimage.com/400x400/e0e0e0/ffffff&text=No+Image'}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={e => e.target.src='https://dummyimage.com/400x400/e0e0e0/ffffff&text=No+Image'}
      />
    </div>
    <div className="p-2 flex flex-col flex-1">
      <h3 className="text-sm font-semibold text-gray-800 mb-1 h-10 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
        {product.name}
      </h3>
      {/* 未來可以放價格 */}
      {/* <p className="text-lg font-bold text-red-500 my-1">$999</p> */}
      <div className="flex items-center gap-1 text-xs text-gray-400 mb-2 truncate">
        <FaBarcode className="h-3 w-3 flex-shrink-0" />
        <span className="font-mono">{product.barcode}</span>
      </div>
      <div className="flex items-center justify-end mt-auto">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-200">
          <FaArrowRight className="h-3 w-3 text-gray-600 group-hover:text-white transition-colors duration-200" />
        </div>
      </div>
    </div>
  </div>
);

/**
 * 列表檢視的商品項目組件 - 【關鍵修正】
 */
const ListProductItem = ({ product, index, navigate }) => (
  <div
    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:bg-gray-50 cursor-pointer group fade-in flex items-center p-4 w-full"
    style={{ animationDelay: `${index * 0.05}s` }}
    onClick={() => navigate(`/product/${product.id}`)}
  >
    {/* 圖片容器：使用內聯樣式強制設定 flex-basis 和 min-width */}
    <div 
      className="w-24 h-24 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden"
      style={{ flexBasis: '6rem', minWidth: '6rem' }} 
    >
      <img
        src={product.imageUrl || 'https://dummyimage.com/100x100/e0e0e0/ffffff&text=No+Image'}
        alt={product.name}
        className="w-full h-full object-cover"
        onError={e => e.target.src='https://dummyimage.com/100x100/e0e0e0/ffffff&text=No+Image'}
      />
    </div>
    <div className="flex-1 ml-4 overflow-hidden">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 truncate">
        {product.name}
      </h3>
      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
        <FaBarcode className="h-4 w-4" />
        <span className="font-mono">{product.barcode}</span>
      </div>
    </div>
    <div className="ml-auto pl-4">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-200">
        <FaArrowRight className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors duration-200" />
      </div>
    </div>
  </div>
);

/**
 * 主頁面組件
 */
const SelectProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { products } = location.state || { products: [] };
  const [view, setView] = useState('grid'); // 'grid' or 'list'

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">沒有找到商品</h1>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          返回首頁
        </button>
      </div>
    );
  }

  const handleSelect = (product) => {
    navigate(`/compare/${product.id}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">選擇商品</h1>
            <p className="mt-1 text-sm text-gray-500">
              找到 {products.length} 個相關結果
            </p>
          </div>
          <div className="flex items-center space-x-2 p-1 bg-gray-200 rounded-lg">
            <button
              onClick={() => setView('grid')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                view === 'grid' ? 'bg-blue-500 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <FaTh className="h-5 w-5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                view === 'list' ? 'bg-blue-500 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <FaList className="h-5 w-5" />
            </button>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-transform duration-200 group"
                onClick={() => handleSelect(product)}
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.imageUrl || 'https://dummyimage.com/300x300/e0e0e0/ffffff&text=No+Image'}
                    alt={product.name}
                    className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://dummyimage.com/300x300/e0e0e0/ffffff&text=No+Image';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{product.barcode}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer flex items-center transform hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleSelect(product)}
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-200 flex items-center justify-center">
                  <img
                    src={product.imageUrl || 'https://dummyimage.com/300x300/e0e0e0/ffffff&text=No+Image'}
                    alt={product.name}
                    className="h-full w-full object-contain p-1"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://dummyimage.com/300x300/e0e0e0/ffffff&text=No+Image';
                    }}
                  />
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{product.barcode}</p>
                </div>
                <div className="p-4">
                  <FaChevronRight className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectProduct;
