import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Typography, MenuItem, Alert, Container } from '@mui/material';
import { authService } from '../services/authService';

const errorOptions = {
  promotion: [
    { value: '優惠錯誤', label: '優惠錯誤' },
    { value: '價格錯誤', label: '價格錯誤' },
    { value: '時間錯誤', label: '時間錯誤' },
    { value: '其他', label: '其他' },
  ],
  price: [
    { value: '商品價格錯誤', label: '商品價格錯誤' },
    { value: '其他', label: '其他' },
  ],
};

const ReportError = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [errorType, setErrorType] = useState('');
  const [description, setDescription] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!errorType) {
      setError('請選擇錯誤類型');
      return;
    }
    try {
      await axios.post('/api/report-error', {
        targetId: id,
        targetType: type,
        errorType,
        description,
        reporterEmail,
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSuccess(true);
      setError('');
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setError('回報失敗，請稍後再試');
    }
  };

  const options = errorOptions[type] || errorOptions['price'];

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 2, borderRadius: 2, bgcolor: 'white' }}>
        <Typography variant="h5" gutterBottom>回報錯誤</Typography>
        {success && <Alert severity="success">回報成功，將自動返回上一頁</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="錯誤類型"
            value={errorType}
            onChange={e => setErrorType(e.target.value)}
            fullWidth
            required
            margin="normal"
          >
            {options.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="備註（可不填）"
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />
          <TextField
            label="聯絡信箱（可不填）"
            value={reporterEmail}
            onChange={e => setReporterEmail(e.target.value)}
            fullWidth
            margin="normal"
            type="email"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            送出回報
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ReportError; 