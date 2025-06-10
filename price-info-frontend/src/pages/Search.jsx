import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!keyword.trim()) {
      alert('請輸入商品名稱或條碼');
      return;
    }

    try {
      const res = await fetch(`/api/products/search?keyword=${encodeURIComponent(keyword)}`);
      const data = await res.json();

      if (data.length === 1) {
        navigate(`/product/${data[0].id}`);
      } else if (data.length > 1) {
        navigate('/select', { state: { products: data } });
      } else {
        alert('找不到商品');
      }
    } catch (error) {
      console.error('搜尋失敗:', error);
      alert('搜尋過程發生錯誤，請稍後再試');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">商品搜尋</h1>
      <div className="flex gap-2">
        <input
          type="text"
          className="border px-2 py-1 rounded text-black"
          placeholder="輸入商品名稱或條碼"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          className="bg-black text-white px-4 py-1 rounded"
          onClick={handleSearch}
        >
          搜尋
        </button>
      </div>
    </div>
  );
};

export default Search;
