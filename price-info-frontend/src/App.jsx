import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Search from "./pages/Search";
import SelectProduct from "./pages/SelectProduct";
import ProductDetail from "./pages/ProductDetail";
import Compare from "./pages/Compare"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 預設導向搜尋頁 */}
        <Route path="/" element={<Navigate to="/search" />} />

        {/* 搜尋頁：輸入關鍵字或掃碼 */}
        <Route path="/search" element={<Search />} />

        {/* 選擇搜尋結果中的商品 */}
        <Route path="/select" element={<SelectProduct />} />

        {/* 商品詳情與比價 */}
        <Route path="/product/:id" element={<ProductDetail />} />

        <Route path="/compare/:id" element={<Compare />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
