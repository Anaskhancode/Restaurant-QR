import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import Cart from './pages/Cart';
import Welcome from './pages/Welcome';
import FindYourAccount from './pages/FindYourAccount';
import ResetPassword from './pages/ResetPassword';

import ProtectRoutes from './components/ProtectedRoutes';
import OpenRoutes from './components/OpenRoutes';

import AdminLayout from './components/AdminLayout';

import { ToastProvider } from './context/ToastContext';
// Admin pages
import Dashboard from './pages/Dashboard';
import AdminMenu from './pages/Menu';
import AdminTables from './pages/Table';
import AdminCoupan from './pages/AdminCoupan';


const App = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>

          {/* ---------------- AUTHENTICATED CUSTOMER ---------------- */}
          <Route element={<ProtectRoutes />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/cart" element={<Cart />} />
          </Route>

          {/* ---------------- AUTHENTICATED ADMIN ---------------- */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="tables" element={<AdminTables />} />
            <Route path="coupans" element={<AdminCoupan />} />
            {/* <Route path="orders" element={<AdminOrders />} /> */}
          </Route>

          {/* ---------------- PUBLIC ---------------- */}
          <Route element={<OpenRoutes />}>
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recovery" element={<FindYourAccount />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;
