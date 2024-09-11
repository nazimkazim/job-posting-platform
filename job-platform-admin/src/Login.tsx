// src/Login.tsx
import React, { useState } from "react";
import { Form, Input, Button, Card, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { apiClient } from "./api/aixos";

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const [loginError, setLoginError] = useState<string | null>(null); // State for storing error message

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const response = await apiClient.post("/api/users/login", values);

      if (!response.data?.token) {
        throw new Error("Invalid email or password.");
      }

      const token = response?.data?.token;
      const userName = response?.data?.name;
      const email = response?.data?.email;
      const avatarUrl = response?.data?.user?.avatar || "";
      const role = response?.data?.role || "";

      localStorage.setItem("token", token);
      localStorage.setItem("userName", userName);
      localStorage.setItem("avatarUrl", avatarUrl);
      localStorage.setItem("email", email);
      localStorage.setItem("role", role);

      navigate("/jobs");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      {loginError && (
        <Alert
          message="Login Error"
          description={loginError}
          type="error"
          showIcon
          closable
          onClose={() => setLoginError(null)}
        />
      )}
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
