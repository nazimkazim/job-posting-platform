// src/Login.tsx
import React from "react";
import { Form, Input, Button, Card } from "antd";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { apiClient } from "./api/aixos";

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const response = await apiClient.post('/api/users/login', values);
      const token = response?.data?.token;
      const userName = response?.data?.name;
      const email = response?.data?.email;
      const avatarUrl = response?.data?.user?.avatar || '';

      console.log("Login response:", response);

      // Store the token and user info in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName);
      localStorage.setItem('avatarUrl', avatarUrl);
      localStorage.setItem('email', email);

      // Redirect to job posts page
      navigate("/jobs");
    } catch (error) {
      console.error("Login error:", error);
      // Handle login error (e.g., show notification)
    }
  };

  return (
    <div className="login-container">
      <Card>
        <h2>Recruiter Login</h2>
        <Form name="login" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
