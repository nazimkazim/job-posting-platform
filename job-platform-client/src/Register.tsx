import React from "react";
import { Form, Input, Button, Card } from "antd";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { apiClient } from "./api/aixos";

export const Register: React.FC = () => {
  const navigate = useNavigate();

  // Function to handle form submission
  const onFinish = async (values: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    try {
      const response = await apiClient.post("/api/users/register", {
        name: values.name,
        email: values.email,
        password: values.password,
        role: "client",
      });

      const token = response?.data?.token;
      const userName = response?.data?.name;
      const email = response?.data?.email;
      const avatarUrl = response?.data?.user?.avatar || "";

      // Store the token and user info in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userName", userName);
      localStorage.setItem("avatarUrl", avatarUrl);
      localStorage.setItem("email", email);

      navigate("/jobs");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="register-container">
      <Card>
        <h2>Register as Job-seeker</h2>
        <Form name="register" onFinish={onFinish}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input placeholder="Full Name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
            hasFeedback
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
