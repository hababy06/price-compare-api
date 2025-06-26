import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip, Alert } from '@mui/material';
import { authService } from '../services/authService';

const typeLabel = {
  DISCOUNT: '打折',
  SPECIAL: '特價',
  BUY_ONE_GET_ONE: '買一送一',
  COUPON: '折價券',
  LIMITED_TIME: '限時搶購',
};

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => { fetchPromotions(); }, []);

  const fetchPromotions = async () => {
    try {
      const user = authService.getCurrentUser();
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      const res = await axios.get('/promotion-info', { headers });
      setPromotions(res.data);
    } catch {
      setError('載入失敗');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除此優惠？')) return;
    try {
      const user = authService.getCurrentUser();
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.delete(`/admin/promotions/${id}`, { headers });
      setPromotions(promotions.filter(p => p.id !== id));
    } catch {
      alert('刪除失敗');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>優惠管理</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Paper sx={{ mt: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>類型</TableCell>
                  <TableCell>折扣/特價</TableCell>
                  <TableCell>商品名稱</TableCell>
                  <TableCell>商店名稱</TableCell>
                  <TableCell>優惠期間</TableCell>
                  <TableCell>備註</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {promotions.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>
                      <Chip label={typeLabel[p.type] || p.type} color="primary" size="small" />
                    </TableCell>
                    <TableCell>
                      {p.type === 'DISCOUNT' && p.discountValue ? `${p.discountValue}折` : ''}
                      {p.type === 'SPECIAL' && p.finalPrice ? `特價 $${p.finalPrice}` : ''}
                      {p.type === 'BUY_ONE_GET_ONE' && '買一送一'}
                      {p.type === 'COUPON' && '折價券'}
                      {p.type === 'LIMITED_TIME' && '限時搶購'}
                    </TableCell>
                    <TableCell>{p.productName || p.productId}</TableCell>
                    <TableCell>{p.storeName}</TableCell>
                    <TableCell>
                      {p.startTime ? p.startTime.replace('T', ' ').slice(0, 16) : '無'} ~ {p.endTime ? p.endTime.replace('T', ' ').slice(0, 16) : '無'}
                    </TableCell>
                    <TableCell>{p.remark}</TableCell>
                    <TableCell>
                      <Button size="small" color="error" variant="outlined" onClick={() => handleDelete(p.id)}>刪除</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminPromotions; 