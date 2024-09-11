// src/components/Layout.tsx
import React from 'react';
import { Layout as AntLayout, Avatar, Button, Dropdown, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  // Get the user data from localStorage
  const userName = localStorage.getItem('userName') || 'Unknown User';
  const avatarUrl = localStorage.getItem('avatarUrl') || ''; // Store avatar URL after login if available

  // Logout function
  const handleLogout = () => {
    // Clear localStorage and redirect to login page
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('avatarUrl');
    navigate('/');
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <Button type="text" onClick={handleLogout}>
          Logout
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <AntLayout>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>
          Recruiter Dashboard
        </div>
        <Dropdown overlay={menu} trigger={['click']}>
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Avatar src={avatarUrl} icon={<UserOutlined />} style={{ marginRight: '8px' }} />
            <span style={{ color: 'white' }}>{userName}</span>
          </div>
        </Dropdown>
      </Header>
      <Content>
        {children}
      </Content>
    </AntLayout>
  );
};
