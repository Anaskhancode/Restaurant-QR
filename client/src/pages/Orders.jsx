import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersOfUser, fetchRazorpayOrder, verifyPayment } from '../redux/orderSlice';
import { useToast } from '../context/ToastContext';

const Orders = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { orders, loading, error } = useSelector((state) => state.order);

  const [scriptLoaded, setScriptLoaded] = useState(false);

  /* ============ Load Razorpay script ============ */
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    dispatch(fetchOrdersOfUser());
  }, [dispatch]);

  const handleContinuePayment = async (orderId) => {
    if (!scriptLoaded) {
      toast.error('Payment system not ready. Please try again in a moment.');
      return;
    }

    try {
      const result = await dispatch(fetchRazorpayOrder(orderId)).unwrap();

      if (!result.razorPayOrder) {
        toast.error('Failed to fetch Razorpay order');
        return;
      }

      const options = {
        key: result.razorPayOrder.key,
        amount: result.razorPayOrder.amount,
        currency: 'INR',
        order_id: result.razorPayOrder.id,
        name: 'Elegent Bites',
        description: 'Food Order Payment',

        handler: async function (response) {
          try {
            await dispatch(
              verifyPayment({
                paymentId: response.razorpay_payment_id,
                razorPayOrderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              })
            ).unwrap();

            toast.success('Payment Successful', 'Order Confirmed');
            dispatch(fetchOrdersOfUser()); // refresh orders
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },

        prefill: {
          name: result.order.customerName,
          email: result.order.customerEmail,
          contact: result.order.customerPhone,
        },

        theme: { color: '#1e2939' },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error('Failed to initiate payment');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading orders...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-400">You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
                <div>
                  <p className="text-sm text-gray-400">Order Number</p>
                  <p className="font-semibold text-lg">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Table No. - {order.tableNumber}
                  </p>
                </div>

                <div className="flex gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                      order.paymentStatus === 'success'
                        ? 'bg-green-600/20 text-green-400'
                        : order.paymentStatus === 'pending'
                        ? 'bg-yellow-600/20 text-yellow-400'
                        : 'bg-red-600/20 text-red-400'
                    }`}
                  >
                    Payment: {order.paymentStatus}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                      order.orderStatus === 'served'
                        ? 'bg-green-600/20 text-green-400'
                        : order.orderStatus === 'preparing'
                        ? 'bg-blue-600/20 text-blue-400'
                        : order.orderStatus === 'ready'
                        ? 'bg-red-600/20 text-red-400'
                        : 'bg-gray-600/20 text-gray-300'
                    }`}
                  >
                    Order: {order.orderStatus || 'PLACED'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-gray-300">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>₹{item.subTotal}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4 border-t border-gray-700 pt-4">
                <p className="text-lg font-semibold">Total: ₹{order.finalAmount || order.subTotal}</p>

                {order.paymentMethod === 'Razorpay' && order.paymentStatus === 'pending' && (
                  <button
                    onClick={() => handleContinuePayment(order._id)}
                    className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Continue Payment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
