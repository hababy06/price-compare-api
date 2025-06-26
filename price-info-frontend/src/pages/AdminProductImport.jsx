import React, { useState } from 'react';
import axios from 'axios';

const AdminProductImport = () => {
  const [fileContent, setFileContent] = useState('');
  const [result, setResult] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => setFileContent(evt.target.result);
    reader.readAsText(file);
  };

  const handleImport = async () => {
    try {
      const products = JSON.parse(fileContent);
      await axios.post('/admin/products/batch-import-with-stores', products, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
      });
      setResult('匯入成功！');
    } catch (err) {
      setResult('匯入失敗：' + (err.response?.data || err.message));
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">商品批次匯入</h2>
      <input type="file" accept=".json" onChange={handleFileChange} />
      <button onClick={handleImport} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded">匯入</button>
      {result && <div className="mt-4">{result}</div>}
    </div>
  );
};

export default AdminProductImport;
