import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHome } from 'react-icons/fa';
import { authService } from "../services/authService";

function AddPromotionForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [product, setProduct] = useState(null);
  const [productError, setProductError] = useState("");
  const [form, setForm] = useState({
    storeId: "",
    type: "DISCOUNT",
    discountValue: "",
    finalPrice: "",
    remark: "",
    hasTimeLimit: true,
    startTime: "",
    endTime: "",
  });
  const [existingPromotion, setExistingPromotion] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    axios.get("/stores").then((res) => setStores(res.data));
    axios.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authService.getCurrentUser()) {
      alert('請先登入');
      navigate('/login');
      return;
    }

    const payload = {
      ...form,
      productId: id,
      discountValue: form.type === "DISCOUNT" ? parseInt(form.discountValue) : null,
      finalPrice: form.type === "SPECIAL" ? parseInt(form.finalPrice) : null,
      startTime: form.hasTimeLimit ? form.startTime || null : null,
      endTime: form.hasTimeLimit ? form.endTime || null : null,
    };

    try {
      // 先檢查是否有相似的優惠
      const user = authService.getCurrentUser();
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      const response = await axios.post(`/promotion-info/${id}/check-similar`, payload, { headers });
      
      if (response.data.similarPromotion) {
        setExistingPromotion(response.data.similarPromotion);
        setShowConfirmDialog(true);
        return;
      }

      // 如果沒有相似的優惠，直接新增
      await axios.post(`/promotion-info/${id}/promotions`, payload, { headers });
      navigate(`/compare/${id}`);
    } catch (err) {
      if (err.response && err.response.data && (err.response.data.message || err.response.data.error)) {
        alert('新增失敗：' + (err.response.data.message || err.response.data.error));
      } else if (err.response && err.response.status) {
        alert('新增失敗，狀態碼：' + err.response.status);
      } else {
        alert('新增失敗：' + err.message);
      }
    }
  };

  const handleConfirmAction = async (action) => {
    try {
      switch (action) {
        case 'confirm':
          // 直接合併優惠
          await axios.post(`/promotion-info/${id}/promotions`, {
            ...form,
            productId: id,
            discountValue: form.type === "DISCOUNT" ? parseInt(form.discountValue) : null,
            finalPrice: form.type === "SPECIAL" ? parseInt(form.finalPrice) : null,
            startTime: form.hasTimeLimit ? form.startTime || null : null,
            endTime: form.hasTimeLimit ? form.endTime || null : null,
            mergeWith: existingPromotion.id
          });
          break;
        case 'addRemark':
          // 合併優惠並添加備註
          await axios.post(`/promotion-info/${id}/promotions`, {
            ...form,
            productId: id,
            discountValue: form.type === "DISCOUNT" ? parseInt(form.discountValue) : null,
            finalPrice: form.type === "SPECIAL" ? parseInt(form.finalPrice) : null,
            startTime: form.hasTimeLimit ? form.startTime || null : null,
            endTime: form.hasTimeLimit ? form.endTime || null : null,
            mergeWith: existingPromotion.id,
            addRemark: true
          });
          break;
        case 'different':
          // 新增為不同的優惠
          await axios.post(`/promotion-info/${id}/promotions`, {
            ...form,
            productId: id,
            discountValue: form.type === "DISCOUNT" ? parseInt(form.discountValue) : null,
            finalPrice: form.type === "SPECIAL" ? parseInt(form.finalPrice) : null,
            startTime: form.hasTimeLimit ? form.startTime || null : null,
            endTime: form.hasTimeLimit ? form.endTime || null : null,
            forceNew: true
          });
          break;
      }
      navigate(`/compare/${id}`);
    } catch (err) {
      alert("操作失敗");
    }
  };

  return (
    <div>
      {productError && <div className="text-red-500 mb-2">{productError}</div>}
      <h2 className="text-2xl font-bold mb-4">
        {product ? `為「${product.name}」新增優惠` : "新增優惠"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>商家：</label>
          <select
            value={form.storeId}
            onChange={(e) => setForm({ ...form, storeId: e.target.value })}
          >
            <option value="">-- 請選擇 --</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>優惠類型：</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="DISCOUNT">打折</option>
            <option value="SPECIAL">特價</option>
          </select>
        </div>

        {form.type === "DISCOUNT" && (
          <div>
            <label>打幾折（如 85 表示 85 折）：</label>
            <input
              type="number"
              value={form.discountValue}
              onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
            />
          </div>
        )}

        {form.type === "SPECIAL" && (
          <div>
            <label>特價價格：</label>
            <input
              type="number"
              value={form.finalPrice}
              onChange={(e) => setForm({ ...form, finalPrice: e.target.value })}
            />
          </div>
        )}

        <div>
          <label>
            <input
              type="checkbox"
              checked={form.hasTimeLimit}
              onChange={(e) => setForm({ ...form, hasTimeLimit: e.target.checked })}
            />
            是否有優惠期限
          </label>
        </div>

        {form.hasTimeLimit && (
          <>
            <div>
              <label>優惠開始時間：</label>
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              />
            </div>
            <div>
              <label>優惠結束時間：</label>
              <input
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </div>
          </>
        )}

        <div>
          <label>備註：</label>
          <input
            type="text"
            value={form.remark}
            onChange={(e) => setForm({ ...form, remark: e.target.value })}
          />
        </div>

        <button type="submit">送出</button>
      </form>
      <button onClick={() => navigate(`/compare/${id}`)} className="mt-4">返回比價頁面</button>

      {/* 確認對話框 */}
      {showConfirmDialog && existingPromotion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">發現相似的優惠</h3>
            <div className="mb-4">
              <p className="font-bold">現有優惠：</p>
              <p>商家：{existingPromotion.storeName}</p>
              <p>
                優惠：
                {existingPromotion.type === 'DISCOUNT'
                  ? `${existingPromotion.discountValue} 折 (最終價: ${existingPromotion.finalPrice} 元)`
                  : `特價 ${existingPromotion.finalPrice} 元`}
              </p>
              <p>期間：{existingPromotion.startTime?.slice(0,10)} ～ {existingPromotion.endTime?.slice(0,10)}</p>
              <p>備註：{existingPromotion.remark || '—'}</p>
              <p>👍 {existingPromotion.reportCount} 人回報</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleConfirmAction('confirm')}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                確認，這是相同的優惠
              </button>
              <button
                onClick={() => handleConfirmAction('addRemark')}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                我要新增備註
              </button>
              <button
                onClick={() => handleConfirmAction('different')}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                不，我的優惠不一樣
              </button>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddPromotionForm;
