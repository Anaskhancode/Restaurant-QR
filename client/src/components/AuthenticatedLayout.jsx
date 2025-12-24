import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { guestout } from '../redux/guestSlice';
import {
  UtensilsCrossed,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ShoppingCart,
  Search,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Footer from './Footer';
import { setSearchQuery } from '../redux/menuSlice';

const AuthenticatedLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const { name, email, role } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const searchQuery = useSelector((state) => state.menu.searchQuery);

  const sessionToken = localStorage.getItem('sessionToken');

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    dispatch(setSearchQuery(value));
  };

  const handleLogout = () => {
    if (sessionToken) {
      dispatch(guestout());
      toast.success('Guest logged out successfully');
      navigate('/welcome');
    } else {
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const handleBeMember = () => {
    localStorage.removeItem('sessionToken');
    dispatch(guestout());
    toast.success('Please register to become a member');
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* HEADER */}
      <header className="bg-gray-900/50 border-b border-gray-800 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700/50 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-gray-200" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">ElegentBites</h2>
                <p className="text-[9px] text-gray-400 uppercase tracking-wider">
                  Restaurant Management
                </p>
              </div>
            </Link>

            {/* SEARCH DESKTOP */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={localSearchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-10 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white"
                />
                {localSearchQuery && (
                  <button
                    onClick={() => {
                      setLocalSearchQuery('');
                      dispatch(setSearchQuery(''));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-4">
              {/* MOBILE MENU */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-300"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>

              {/* CART */}
              <Link to="/cart" className="relative p-2 text-gray-300">
                <ShoppingCart />
                <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.reduce((a, i) => a + i.quantity, 0)}
                </span>
              </Link>

              {/* PROFILE */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50"
                >
                  <User className="w-4 h-4 text-gray-300" />
                  <div className="text-left">
                    <p className="text-xs text-white">{name || 'User'}</p>
                    <p className="text-[10px] text-gray-400">
                      {sessionToken ? 'Guest' : role}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg z-20">
                      <div className="p-4 border-b border-gray-800">
                        <p className="text-sm text-white">{name || 'Guest User'}</p>
                        <p className="text-xs text-gray-400">{email || 'No email'}</p>
                      </div>

                      <div className="p-2">
                        {sessionToken ? (
                          <button
                            onClick={handleBeMember}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-400 hover:bg-green-500/10 rounded-lg"
                          >
                            <User className="w-4 h-4" />
                            Be a Member
                          </button>
                        ) : (
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg">
                            <User className="w-4 h-4" />
                            Profile Settings
                          </button>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default AuthenticatedLayout;
