import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import { authService } from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const isHomePage = location.pathname === '/';

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
    window.location.reload(); // 強制刷新，確保狀態同步
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '56px',
      background: '#fff',
      borderBottom: '1px solid #eee',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 1000,
      padding: '0 2rem',
      boxSizing: 'border-box'
    }}>
      {!isHomePage && (
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333' }}
          title="返回上一頁"
        >
          <FaArrowLeft size={28} />
        </button>
      )}
      <div style={{ flex: 1 }}></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <span style={{ color: '#16a34a', fontWeight: 600 }}>已登入</span>
            <button
              onClick={handleLogout}
              style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 18px', fontWeight: 600, cursor: 'pointer' }}
            >
              登出
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 18px', fontWeight: 600, cursor: 'pointer' }}
          >
            登入
          </button>
        )}
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333' }}
          title="回主頁"
        >
          <FaHome size={28} />
        </button>
      </div>
    </div>
  );
};

export default Navbar; 