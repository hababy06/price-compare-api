import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>商品列表</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name}（{p.barcode}）
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
