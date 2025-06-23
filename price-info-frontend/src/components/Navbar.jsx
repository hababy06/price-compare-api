import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { authService } from '../services/authService';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box, Avatar } from '@mui/material';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const isHomePage = location.pathname === '/';

  // 解析 JWT 取得權限
  let isAdmin = false;
  if (user && user.token) {
    try {
      const payload = JSON.parse(atob(user.token.split('.')[1]));
      if (payload.roles && (payload.roles.includes('ROLE_ADMIN') || payload.roles.includes('ADMIN'))) {
        isAdmin = true;
      }
    } catch {}
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleAdminMenu = (event) => {
    setAdminAnchorEl(event.currentTarget);
  };
  const handleAdminClose = () => {
    setAdminAnchorEl(null);
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
    window.location.reload();
  };

  return (
    <AppBar 
      position="static" 
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Toolbar sx={{ minHeight: '70px' }}>
        {!isHomePage && (
          <Button 
            color="inherit" 
            onClick={() => navigate(-1)}
            sx={{
              mr: 2,
              borderRadius: '12px',
              px: 2,
              py: 1,
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease'
              }
            }}
          >
            <FaArrowLeft size={20} />
          </Button>
        )}
        
        <Typography 
          variant="h5" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            color: 'white', 
            textDecoration: 'none',
            fontWeight: 700,
            background: 'linear-gradient(45deg, #fff, #f0f0f0)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.2s ease'
            }
          }}
        >
          🛒 智慧比價系統
        </Typography>
        
        <div style={{ flex: 1 }}></div>
        
        {isAdmin && (
          <>
            <Button 
              color="inherit" 
              onClick={handleAdminMenu}
              sx={{
                mr: 2,
                borderRadius: '12px',
                px: 3,
                py: 1,
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease'
                }
              }}
            >
              <FaCog style={{ marginRight: '8px' }} />
              管理功能
            </Button>
            <Menu 
              anchorEl={adminAnchorEl} 
              open={Boolean(adminAnchorEl)} 
              onClose={handleAdminClose}
              PaperProps={{
                sx: {
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  mt: 1
                }
              }}
            >
              <MenuItem component={Link} to="/admin/users" onClick={handleAdminClose}>👥 用戶管理</MenuItem>
              <MenuItem component={Link} to="/admin/products" onClick={handleAdminClose}>📦 商品管理</MenuItem>
              <MenuItem component={Link} to="/admin/stores" onClick={handleAdminClose}>🏪 商店管理</MenuItem>
              <MenuItem component={Link} to="/admin/error-reports" onClick={handleAdminClose}>⚠️ 錯誤回報管理</MenuItem>
            </Menu>
          </>
        )}
        
        {user ? (
          <>
            <Button 
              color="inherit" 
              onClick={handleMenu}
              sx={{
                mr: 2,
                borderRadius: '12px',
                px: 3,
                py: 1,
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease'
                }
              }}
            >
              <Avatar sx={{ width: 24, height: 24, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <FaUser size={12} />
              </Avatar>
              {user.username || '帳號'}
            </Button>
            <Menu 
              anchorEl={anchorEl} 
              open={Boolean(anchorEl)} 
              onClose={handleClose}
              PaperProps={{
                sx: {
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  mt: 1
                }
              }}
            >
              <MenuItem component={Link} to="/profile" onClick={handleClose}>👤 個人資料</MenuItem>
              <MenuItem onClick={() => { handleClose(); handleLogout(); }}>🚪 登出</MenuItem>
            </Menu>
          </>
        ) : (
          <Button 
            color="inherit" 
            component={Link} 
            to="/login"
            sx={{
              mr: 2,
              borderRadius: '12px',
              px: 4,
              py: 1,
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease'
              }
            }}
          >
            登入
          </Button>
        )}
        
        <Button 
          color="inherit" 
          onClick={() => navigate('/')} 
          title="回主頁"
          sx={{
            borderRadius: '12px',
            px: 2,
            py: 1,
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease'
            }
          }}
        >
          <FaHome size={20} />
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 