import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'
import Register from './pages/Register'
import Homepage from './pages/Homepage';
import ProtectRoutes from './components/ProtectedRoutes';
import OpenRoutes from './components/OpenRoutes';
import Welcome from './pages/Welcome';
import { ToastProvider } from './context/ToastContext';
import Cart from './pages/Cart';

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>

          {/* Protected */}
          <Route element={<ProtectRoutes />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/cart" element={<Cart/>} />

          </Route>

          {/* Public (unauthenticated only) */}
          <Route element={<OpenRoutes />}>
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

        </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App
