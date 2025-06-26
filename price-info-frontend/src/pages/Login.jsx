import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect') || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.login(username, password);
            navigate(redirect);
        } catch (err) {
            setError(err.response?.data?.message || '登入失敗');
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
                    登入
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                        {error}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="使用者名稱"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="密碼"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        登入
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <MuiLink component={Link} to="/register" variant="body2">
                            註冊新帳號
                        </MuiLink>
                        <MuiLink component={Link} to="/forgot-password" variant="body2">
                            忘記密碼？
                        </MuiLink>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;