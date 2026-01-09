import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../redux/orderSlice';

const statusStyles = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  preparing: 'bg-blue-500/10 text-blue-400',
  ready: 'bg-green-500/10 text-green-400',
  served: 'bg-gray-500/10 text-gray-300',
};

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { allOrders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, orderStatus: status }));
  };

  return (
    <div className="space-y-10">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">
          Manage Orders
        </h1>
        <p className="text-gray-400">
          View and update all customer orders
        </p>
      </div>

      {/* ================= ORDERS TABLE ================= */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            All Orders
          </h2>
          <span className="text-sm text-gray-400">
            Total: {allOrders.length}
          </span>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading orders...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="py-2 text-left">Order ID</th>
                  <th className="py-2 text-left">Customer</th>
                  <th className="py-2 text-left">Table</th>
                  <th className="py-2 text-left">Amount</th>
                  <th className="py-2 text-left">Payment</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">Update</th>
                </tr>
              </thead>

              <tbody>
                {allOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-800 last:border-none"
                  >
                    <td className="py-3 text-white">
                      {order.orderNumber}
                    </td>

                    <td className="py-3 text-gray-300">
                      {order.customerName || order.userId?.name}
                    </td>

                    <td className="py-3 text-gray-300">
                      {order.tableNumber}
                    </td>

                    <td className="py-3 text-white">
                      ₹{order.finalAmount}
                    </td>

                    <td className="py-3 text-gray-300">
                      {order.paymentMethod} / {order.paymentStatus}
                    </td>

                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          statusStyles[order.orderStatus]
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="py-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="bg-gray-800/60 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-gray-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="served">Served</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      
    </div>
  );
};

export default AdminOrders;
