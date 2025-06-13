import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Alert
} from '@mui/material';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('兩次輸入的密碼不一致');
            return;
        }
        try {
            await authService.resetPassword(token, newPassword, confirmPassword);
            setSuccess(true);
            setError('');
            // 3秒後跳轉到登入頁面
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || '重置密碼失敗');
            setSuccess(false);
        }
    };

    if (!token) {
        return (
            <Container component="main" maxWidth="xs">
                <Box sx={{ mt: 8 }}>
                    <Alert severity="error">
                        無效的重置密碼連結
                    </Alert>
                </Box>
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    重置密碼
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
                        密碼重置成功，即將跳轉到登入頁面
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="newPassword"
                        label="新密碼"
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="確認新密碼"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        重置密碼
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ResetPassword; 