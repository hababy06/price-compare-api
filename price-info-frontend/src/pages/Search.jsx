import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarcodeScanner from '../components/BarcodeScanner';
import { FaSearch, FaBarcode, FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';

const Search = () => {
  const [keyword, setKeyword] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (inputKeyword) => {
    const searchValue = inputKeyword !== undefined ? inputKeyword : keyword;
    if (!searchValue.trim()) {
      alert('請輸入商品名稱或條碼');
      return;
    }

    try {
      const res = await axios.get(`/products/search?keyword=${encodeURIComponent(searchValue)}`);
      const data = res.data;
      setResults(data);
      setError('');

      if (data.length === 1) {
        navigate(`/product/${data[0].id}`);
      } else if (data.length > 1) {
        navigate('/select', { state: { products: data } });
      } else {
        alert('找不到商品');
      }
    } catch (err) {
      setError('搜尋結果發生錯誤，請稍後再試');
      setResults([]);
    }
  };

  const handleBarcodeDetected = (barcode) => {
    setKeyword(barcode);
    setShowScanner(false);
    setTimeout(() => handleSearch(barcode), 100);
  };

  const handleShowScanner = () => {
    setShowScanner(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 主標題區域 */}
        <div className="text-center mb-12 fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg">
            <FaShoppingCart className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            智慧比價系統
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            快速搜尋商品價格，比較各大商店，找到最優惠的選擇
          </p>
        </div>

        {/* 搜尋卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 fade-in" style={{animationDelay: '0.1s'}}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              搜尋商品
            </h2>
            
            {/* 搜尋輸入區域 */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="輸入商品名稱或條碼..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                onClick={() => handleSearch()}
              >
                <FaSearch className="h-5 w-5" />
                搜尋
              </button>
            </div>

            {/* 掃描條碼按鈕 */}
            <div className="text-center">
              <button
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mx-auto"
                onClick={handleShowScanner}
              >
                <FaBarcode className="h-5 w-5" />
                掃描條碼
              </button>
            </div>
          </div>
        </div>

        {/* 功能特色卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 fade-in" style={{animationDelay: '0.2s'}}>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FaSearch className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">快速搜尋</h3>
            <p className="text-gray-600">輸入商品名稱或條碼，立即找到相關商品</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 fade-in" style={{animationDelay: '0.3s'}}>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FaBarcode className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">條碼掃描</h3>
            <p className="text-gray-600">使用手機相機掃描商品條碼，快速識別</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 fade-in" style={{animationDelay: '0.4s'}}>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <FaShoppingCart className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">價格比較</h3>
            <p className="text-gray-600">比較各大商店價格，找到最優惠的選擇</p>
          </div>
        </div>

        {/* 條碼掃描器 */}
        {showScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <BarcodeScanner
                onDetected={handleBarcodeDetected}
                onClose={() => setShowScanner(false)}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Search;
