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
      <div style={{ paddingTop: '64px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
