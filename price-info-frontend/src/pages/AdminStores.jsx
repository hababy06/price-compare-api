import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { authService } from '../services/authService';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [editStore, setEditStore] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { fetchStores(); }, []);

  const fetchStores = async () => {
    try {
      const user = authService.getCurrentUser();
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      const res = await axios.get('/admin/stores', { headers });
      setStores(res.data);
    } catch {
      setError('載入失敗');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除此商店？')) return;
    try {
      const user = authService.getCurrentUser();
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.delete(`/admin/stores/${id}`, { headers });
      setStores(stores.filter(s => s.id !== id));
    } catch {
      alert('刪除失敗');
    }
  };

  const handleEdit = (store) => setEditStore(store);
  const handleCloseDialog = () => setEditStore(null);

  const handleSave = async () => {
    try {
      const user = authService.getCurrentUser();
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.put(`/admin/stores/${editStore.id}`, editStore, { headers });
      setStores(stores.map(s => s.id === editStore.id ? editStore : s));
      setEditStore(null);
    } catch {
      alert('更新失敗');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>商店管理</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Paper sx={{ mt: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>名稱</TableCell>
                  <TableCell>地址</TableCell>
                  <TableCell>Logo</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stores.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>{s.id}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.address}</TableCell>
                    <TableCell>
                      {s.logoUrl && <img src={s.logoUrl} alt={s.name} style={{height:32}} onError={e => e.target.src='https://dummyimage.com/64x64/cccccc/ffffff&text=No+Logo'} />}
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" onClick={() => handleEdit(s)}>編輯</Button>
                      <Button size="small" color="error" variant="outlined" sx={{ ml: 1 }} onClick={() => handleDelete(s.id)}>刪除</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Dialog open={!!editStore} onClose={handleCloseDialog}>
          <DialogTitle>編輯商店</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="名稱" value={editStore?.name || ''} onChange={e => setEditStore({ ...editStore, name: e.target.value })} />
            <TextField label="地址" value={editStore?.address || ''} onChange={e => setEditStore({ ...editStore, address: e.target.value })} />
            <TextField label="Logo網址" value={editStore?.logoUrl || ''} onChange={e => setEditStore({ ...editStore, logoUrl: e.target.value })} />
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

export default AdminStores; 