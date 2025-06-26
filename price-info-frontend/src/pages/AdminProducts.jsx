import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { authService } from '../services/authService';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const user = authService.getCurrentUser();
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      const res = await axios.get('/admin/products', { headers });
      setProducts(res.data);
    } catch {
      setError('載入失敗');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除此商品？')) return;
    try {
      const user = authService.getCurrentUser();
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.delete(`/admin/products/${id}`, { headers });
      setProducts(products.filter(p => p.id !== id));
    } catch {
      alert('刪除失敗');
    }
  };

  const handleEdit = (product) => setEditProduct(product);
  const handleCloseDialog = () => setEditProduct(null);

  const handleSave = async () => {
    try {
      const user = authService.getCurrentUser();
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.put(`/admin/products/${editProduct.id}`, editProduct, { headers });
      setProducts(products.map(p => p.id === editProduct.id ? editProduct : p));
      setEditProduct(null);
    } catch {
      alert('更新失敗');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>商品管理</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Paper sx={{ mt: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>名稱</TableCell>
                  <TableCell>條碼</TableCell>
                  <TableCell>圖片</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.barcode}</TableCell>
                    <TableCell>
                      {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{height:32}} onError={e => e.target.src='https://dummyimage.com/64x64/cccccc/ffffff&text=No+Image'} />}
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" onClick={() => handleEdit(p)}>編輯</Button>
                      <Button size="small" color="error" variant="outlined" sx={{ ml: 1 }} onClick={() => handleDelete(p.id)}>刪除</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Dialog open={!!editProduct} onClose={handleCloseDialog}>
          <DialogTitle>編輯商品</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="名稱" value={editProduct?.name || ''} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })} />
            <TextField label="條碼" value={editProduct?.barcode || ''} onChange={e => setEditProduct({ ...editProduct, barcode: e.target.value })} />
            <TextField label="圖片網址" value={editProduct?.imageUrl || ''} onChange={e => setEditProduct({ ...editProduct, imageUrl: e.target.value })} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>取消</Button>
            <Button onClick={handleSave} variant="contained">儲存</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminProducts; 