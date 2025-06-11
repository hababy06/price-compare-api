import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AddPromotionForm = () => {
  const { id } = useParams(); // 商品 ID
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({
    storeId: '',
    type: 'DISCOUNT',
    discountValue: '',
    finalPrice: '',
    remark: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(setProduct);

    fetch('/api/stores')
      .then(res => res.json())
      .then(setStores);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      discountValue: form.type === 'DISCOUNT' ? Number(form.discountValue) : null,
      finalPrice: form.type === 'SPECIAL' ? Number(form.finalPrice) : null,
      productId: Number(id),
      storeId: Number(form.storeId)
    };

    const res = await fetch(`/api/promotion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert('新增成功！');
      navigate(`/compare/${id}`);
    } else {
      const text = await res.text();
      alert('新增失敗：' + text);
    }
  };

  if (!product) return <div className="p-6">載入中...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">為「{product.name}」新增優惠</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label>商家：</label>
          <select name="storeId" value={form.storeId} onChange={handleChange} required>
            <option value="">請選擇</option>
            {stores.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>優惠類型：</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="DISCOUNT">打折</option>
            <option value="SPECIAL">特價</option>
          </select>
        </div>

        {form.type === 'DISCOUNT' && (
          <div>
            <label>打幾折（如 85 表示 85 折）：</label>
            <input
              type="number"
              name="discountValue"
              value={form.discountValue}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {form.type === 'SPECIAL' && (
          <div>
            <label>特價後價格：</label>
            <input
              type="number"
              name="finalPrice"
              value={form.finalPrice}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div>
          <label>優惠起始時間：</label>
          <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} />
        </div>

        <div>
          <label>優惠結束時間：</label>
          <input type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} />
        </div>

        <div>
          <label>備註：</label>
          <input type="text" name="remark" value={form.remark} onChange={handleChange} />
        </div>

        <button type="submit" className="bg-black text-white px-4 py-2 rounded">送出</button>
      </form>

      <div className="pt-6">
        <button
          className="text-sm underline text-gray-400 hover:text-white"
          onClick={() => navigate(`/compare/${id}`)}
        >
          返回比價頁面
        </button>
      </div>
    </div>
  );
};

export default AddPromotionForm;
