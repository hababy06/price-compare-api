import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function AddPromotionForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
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

  useEffect(() => {
    axios.get("/api/stores").then((res) => setStores(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      productId: id,
      discountValue: form.type === "DISCOUNT" ? parseInt(form.discountValue) : null,
      finalPrice: form.type === "SPECIAL" ? parseInt(form.finalPrice) : null,
      startTime: form.hasTimeLimit ? form.startTime || null : null,
      endTime: form.hasTimeLimit ? form.endTime || null : null,
    };

    try {
      await axios.post(`/api/promotion-info/${id}/promotions`, payload);
      navigate(`/compare/${id}`);
    } catch (err) {
      alert("新增失敗");
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="mb-4 bg-gray-200 px-3 py-1 rounded"
      >
        ← 返回搜尋頁面
      </button>
      <h2 className="text-2xl font-bold mb-4">為「可口可樂330ml」新增優惠</h2>
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
    </div>
  );
}

export default AddPromotionForm;
