import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip, Alert } from '@mui/material';
import { authService } from '../services/authService';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const user = authService.getCurrentUser();
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      const res = await axios.get('/admin/users', { headers });
      setUsers(res.data);
    } catch (err) {
      setError('載入失敗');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除此用戶？')) return;
    try {
      const user = authService.getCurrentUser();
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.delete(`/admin/users/${id}`, { headers });
      setUsers(users.filter(u => u.id !== id));
    } catch {
      alert('刪除失敗');
    }
  };

  const handleToggleStatus = async (id, status) => {
    const newStatus = status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const user = authService.getCurrentUser();
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.put(`/admin/users/${id}/status?status=${newStatus}`, {}, { headers });
      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    } catch {
      alert('狀態切換失敗');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>用戶管理</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Paper sx={{ mt: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>帳號</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>暱稱</TableCell>
                  <TableCell>狀態</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.nickname}</TableCell>
                    <TableCell>
                      <Chip label={u.status === 'ACTIVE' ? '啟用' : '停用'} color={u.status === 'ACTIVE' ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" onClick={() => handleToggleStatus(u.id, u.status)}>
                        {u.status === 'ACTIVE' ? '停用' : '啟用'}
                      </Button>
                      <Button size="small" color="error" variant="outlined" sx={{ ml: 1 }} onClick={() => handleDelete(u.id)}>
                        刪除
                      </Button>
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

export default AdminUsers; 