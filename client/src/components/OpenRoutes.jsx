import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
function OpenRoutes() {
  const accessToken = localStorage.getItem('accessToken');
  const sessionToken=localStorage.getItem('sessionToken')
  if (accessToken || sessionToken) {
    return <Navigate to="/" />;
  }
  return  <Outlet />;
}

export default OpenRoutes;

