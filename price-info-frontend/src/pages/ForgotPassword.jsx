import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Alert,
    Link as MuiLink
} from '@mui/material';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.forgotPassword(email);
            setSuccess(true);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || '發送重置密碼郵件失敗');
            setSuccess(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    忘記密碼
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
                        重置密碼郵件已發送，請檢查您的信箱
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="電子郵件"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        發送重置密碼郵件
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <MuiLink component={Link} to="/login" variant="body2">
                            返回登入
                        </MuiLink>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default ForgotPassword; 