// src/NotFound.tsx
import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Button type="primary" onClick={() => navigate('/')}>
        Go Back to Home
      </Button>
    </div>
  );
};
