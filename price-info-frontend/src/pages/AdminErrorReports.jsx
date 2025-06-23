import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip, TablePagination, Alert, Container } from '@mui/material';
import { authService } from '../services/authService';

const AdminErrorReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [handled, setHandled] = useState({}); // {id: true/false}

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const user = authService.getCurrentUser();
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      const res = await axios.get('/api/report-error', { headers });
      setReports(res.data);
      setLoading(false);
    } catch (err) {
      setError('載入失敗');
      setLoading(false);
    }
  };

  const handleMarkHandled = (id) => {
    setHandled(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>錯誤回報管理</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Paper sx={{ mt: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>對象類型</TableCell>
                  <TableCell>對象ID</TableCell>
                  <TableCell>錯誤類型</TableCell>
                  <TableCell>備註</TableCell>
                  <TableCell>回報人</TableCell>
                  <TableCell>信箱</TableCell>
                  <TableCell>時間</TableCell>
                  <TableCell>狀態</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.targetType}</TableCell>
                    <TableCell>{r.targetId}</TableCell>
                    <TableCell>{r.errorType}</TableCell>
                    <TableCell>{r.description}</TableCell>
                    <TableCell>{r.username || '-'}</TableCell>
                    <TableCell>{r.reporterEmail || '-'}</TableCell>
                    <TableCell>{r.createdAt ? r.createdAt.replace('T', ' ').slice(0, 19) : ''}</TableCell>
                    <TableCell>
                      {handled[r.id] ? <Chip label="已處理" color="success" /> : <Chip label="未處理" color="warning" />}
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" onClick={() => handleMarkHandled(r.id)}>
                        {handled[r.id] ? '標記未處理' : '標記已處理'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={reports.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[5, 10, 20, 50]}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminErrorReports; 