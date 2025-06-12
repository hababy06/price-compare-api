import React, { useState } from 'react';
import { Form, Input, Button, message, Alert } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setApiError(null);
    try {
      // 假設你的註冊 API 是 /api/auth/register
      await axios.post('/api/auth/register', values);
      message.success('註冊成功，請登入！');
      navigate('/login'); // 註冊成功後導向登入頁
    } catch (err) {
      setApiError(err.response?.data?.message || '註冊失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: '60px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #f0f1f2' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>註冊新帳號</h2>
      {apiError && <Alert message={apiError} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Form
        name="register"
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
          label="Email"
          name="email"
          rules={[{ required: true, message: '請輸入Email' }, { type: 'email', message: 'Email格式錯誤' }]}
        >
          <Input placeholder="請輸入Email" />
        </Form.Item>
        <Form.Item
          label="密碼"
          name="password"
          rules={[{ required: true, message: '請輸入密碼' }]}
        >
          <Input.Password placeholder="請輸入密碼" />
        </Form.Item>
        <Form.Item
          label="確認密碼"
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: '請再次輸入密碼' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('兩次密碼輸入不一致!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="請再次輸入密碼" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            註冊
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;