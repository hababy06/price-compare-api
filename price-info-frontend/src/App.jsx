import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Search from "./pages/Search";
import SelectProduct from "./pages/SelectProduct";
import ProductDetail from "./pages/ProductDetail";
import Compare from "./pages/Compare";
import AddPromotionForm from "./pages/AddPromotionForm";
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ReportError from './pages/ReportError';
import AdminErrorReports from './pages/AdminErrorReports';
import AdminUsers from './pages/AdminUsers';
import AdminProducts from './pages/AdminProducts';
import AdminStores from './pages/AdminStores';
import AdminProductImport from './pages/AdminProductImport';
import AdminPromotions from './pages/AdminPromotions';
import { authService } from './services/authService';
import Navbar from './components/Navbar';

// 受保護的路由組件
const ProtectedRoute = ({ children }) => {
    const user = authService.getCurrentUser();
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ paddingTop: '64px', minHeight: '100vh', width: '100%' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Search />} />
          <Route path="/search" element={<Search />} />
          <Route path="/select" element={<SelectProduct />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/compare/:id" element={<Compare />} />
          <Route path="/add-promotion/:id" element={<AddPromotionForm />} />
          <Route path="/report-error/:type/:id" element={<ReportError />} />
          <Route path="/admin/error-reports" element={<AdminErrorReports />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/stores" element={<AdminStores />} />
          <Route path="/admin/products/import" element={<AdminProductImport />} />
          <Route path="/admin/promotions" element={<AdminPromotions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
