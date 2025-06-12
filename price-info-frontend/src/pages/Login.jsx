import React, { useState } from 'react';
import { Form, Input, Button, message, Alert } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setApiError(null);
    try {
      await axios.post('/api/auth/login', values);
      message.success('登入成功');
      navigate('/search'); // 登入成功後導向搜尋頁面
    } catch (err) {
      setApiError(err.response?.data?.message || '登入失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: '60px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #f0f1f2' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>登入</h2>
      {apiError && <Alert message={apiError} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Form
        name="login"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="帳號"
          name="username"
          rules={[{ required: true, message: '請輸入帳號' }]}
        >
          <Input placeholder="請輸入帳號" />
        </Form.Item>

        <Form.Item
          label="密碼"
          name="password"
          rules={[{ required: true, message: '請輸入密碼' }]}
        >
          <Input.Password placeholder="請輸入密碼" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            登入
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
  還沒有帳號嗎？<a href="/register">點此註冊</a>
</div>
      </Form>
    </div>
  );
};

export default Login;