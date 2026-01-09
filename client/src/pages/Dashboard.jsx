import React, { useEffect } from 'react';
import {
  ShoppingBag,
  IndianRupee,
  BookOpen,
  Table,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecentOrders } from '../redux/orderSlice.js';
import { fetchDashboardStats } from '../redux/adminSlice.js';

const Dashboard = () => {
  const dispatch = useDispatch();

  const { recentOrders } = useSelector((state) => state.order);
  const { stats = {}, loading } = useSelector((state) => state.admin);


  useEffect(() => {
    dispatch(fetchRecentOrders());
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
    },
    {
      title: 'Revenue',
      value: `₹${stats.totalRevenue}`,
      icon: IndianRupee,
    },
    {
      title: 'Menu Items',
      value: stats.totalMenuItems,
      icon: BookOpen,
    },
    {
      title: 'Active Tables',
      value: stats.totalTables,
      icon: Table,
    },
    {
      title: 'Active Coupons',
      value: stats.totalActiveCoupans,
      icon: Tag,
    },
  ];

  return (
    <div className="space-y-10">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">
          Dashboard
        </h1>
        <p className="text-gray-400">
          Real-time overview of your restaurant
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((item, index) => (
          <div
            key={index}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 flex items-center justify-between hover:border-gray-700 transition"
          >
            <div>
              <p className="text-sm text-gray-400">{item.title}</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {loading ? '...' : item.value}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center">
              <item.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* -------- Recent Orders -------- */}
        <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Recent Orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="py-2 text-left">Order ID</th>
                  <th className="py-2 text-left">Customer</th>
                  <th className="py-2 text-left">Amount</th>
                  <th className="py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-800 last:border-none"
                  >
                    <td className="py-3 text-white">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 text-gray-300">
                      {order.customerName || `Table ${order.tableNumber}`}
                    </td>
                    <td className="py-3 text-white">
                      ₹{order.finalAmount}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          order.orderStatus === 'served'
                            ? 'bg-green-500/10 text-green-400'
                            : order.orderStatus === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : order.orderStatus === 'preparing'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-gray-500/10 text-gray-300'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* -------- Quick Actions -------- */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">
            Quick Actions
          </h2>

          <Link to="/admin/menu" className="block">
            <ActionButton label="Add New Menu Item" />
          </Link>

          <Link to="/admin/orders" className="block">
            <ActionButton label="Manage Orders" />
          </Link>

          <Link to="/admin/tables" className="block">
            <ActionButton label="Manage Tables" />
          </Link>

          <Link to="/admin/coupans" className="block">
            <ActionButton label="Manage Coupons" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ label }) => (
  <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-800/60 hover:bg-gray-800 rounded-lg text-white text-sm transition">
    {label}
    <ArrowRight className="w-4 h-4" />
  </button>
);

export default Dashboard;
