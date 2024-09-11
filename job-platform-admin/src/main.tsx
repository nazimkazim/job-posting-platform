import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Login } from './Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JobPosts } from './JobsPost';
import "./main.css";
import { PrivateRoute } from './PrivateRoute';
import { Layout } from './Layout';
import { PublicRoute } from './PublicRoute';
import { NotFound } from './NotFoundPage';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<PublicRoute element={<Login />} />} />
          <Route
            path="/jobs"
            element={<PrivateRoute element={<Layout><JobPosts /></Layout>} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
