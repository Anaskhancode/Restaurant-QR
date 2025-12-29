import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import {
  UtensilsCrossed,
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  Table,
  User,
  LogOut,
  Menu,
  X,
  CloudUploadIcon,
  Gift,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Footer from '../components/Footer';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const { name, email } = useSelector((state) => state.auth);
  const role =
    useSelector((state) => state.auth.role) ||
    localStorage.getItem('role');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ---------- ADMIN GUARD ---------- */
  if (role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Admin logged out');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen
        bg-gray-900 border-r border-gray-800
        flex flex-col
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-800">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">ElegantBites</h2>
            <p className="text-[10px] text-gray-400 uppercase">Admin Panel</p>
          </div>

          {/* Close (mobile) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto md:hidden text-gray-400 hover:text-white"
          >
            <X />
          </button>
        </div>

        {/* Navigation (scrollable only inside sidebar) */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <SidebarLink to="/admin/dashboard" icon={LayoutDashboard} onClick={() => setSidebarOpen(false)} label="Dashboard" />
          <SidebarLink to="/admin/menu" icon={BookOpen} onClick={() => setSidebarOpen(false)} label="Menu" />
          <SidebarLink to="/admin/orders" icon={ShoppingBag} onClick={() => setSidebarOpen(false)} label="Orders" />
          <SidebarLink to="/admin/tables" icon={Table} onClick={() => setSidebarOpen(false)} label="Tables" />
          <SidebarLink to="/admin/coupans" icon={Gift} onClick={() => setSidebarOpen(false)} label="Coupans" />
        </nav>

        {/* Logout (always visible) */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2
            text-red-400 hover:bg-red-500/10 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= MAIN ================= */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-gray-900/50 border-b border-gray-800
        flex items-center justify-between px-6 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <Menu />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-300" />
            </div>
            <div className="text-right">
              <p className="text-sm text-white">{name || 'Admin'}</p>
              <p className="text-[10px] text-gray-400">{email || 'admin@site.com'}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

/* ---------- Sidebar Link ---------- */
const SidebarLink = ({ to, icon: Icon, label ,onClick}) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-2
    text-gray-300 hover:text-white hover:bg-gray-800
    rounded-lg transition"
  >
    <Icon className="w-5 h-5" />
    {label}
  </Link>
);

export default AdminLayout;
