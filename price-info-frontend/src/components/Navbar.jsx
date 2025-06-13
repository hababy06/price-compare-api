import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { authService } from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

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
      <button
        onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333' }}
        title="回主頁"
      >
        <FaHome size={28} />
      </button>
      <div>
        {user ? (
          <span style={{ color: '#16a34a', fontWeight: 600 }}>已登入</span>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 18px', fontWeight: 600, cursor: 'pointer' }}
          >
            登入
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar; 