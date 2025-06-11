import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Search from "./pages/Search";
import SelectProduct from "./pages/SelectProduct";
import ProductDetail from "./pages/ProductDetail";
import Compare from "./pages/Compare";
import AddPromotionForm from "./pages/AddPromotionForm"; // ✅ 新增這行

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/search" />} />
        <Route path="/search" element={<Search />} />
        <Route path="/select" element={<SelectProduct />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/compare/:id" element={<Compare />} />
        <Route path="/add-promotion/:id" element={<AddPromotionForm />} /> {/* ✅ 新增這行 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
