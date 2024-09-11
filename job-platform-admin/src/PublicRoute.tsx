// src/PublicRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  element: React.ReactElement;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
  const token = localStorage.getItem('token');

  // If the user is logged in (token exists), redirect to the /jobs page
  if (token) {
    return <Navigate to="/jobs" />;
  }

  // If no token, render the component (login page)
  return element;
};
