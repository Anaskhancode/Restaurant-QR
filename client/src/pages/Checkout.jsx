import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, resetOrder } from '../redux/orderSlice.js';
import { fetchCartByUser } from '../redux/cartSlice.js';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();
  const userId = useSelector((state) => state.auth.userId);

  const {
    items,
    totalCartPrice,
    discountAmount,
    finalAmount,
    appliedCoupan,
  } = useSelector((state) => state.cart);

  const { loading, error, success } = useSelector((state) => state.order);

  const [formData, setFormData] = useState({
    tableNumber: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    notes: '',
    paymentMethod: 'CASH',
  });

  /* ================= FETCH CART ================= */
  useEffect(() => {
    if (userId) {
      dispatch(fetchCartByUser(userId));
    }
  }, [dispatch, userId]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (items.length === 0) return;

    if (formData.paymentMethod === 'CASH') {
      dispatch(createOrder(formData));
    }

    if (formData.paymentMethod === 'RAZORPAY') {
      // 👉 NEXT STEP: Razorpay integration
      // For now just create order (PAYMENT_PENDING)
      dispatch(createOrder(formData));
    }
  };

  /* ================= SUCCESS HANDLING ================= */
  useEffect(() => {
    if (success) {
      // better UX than alert
      setTimeout(() => {
        dispatch(resetOrder());
        navigate('/cart')
        toast.success('Order Placed Successfully! ')
      }, 1500);
    }
  }, [success, dispatch,navigate]);

  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {items.length === 0 ? (
        <p className="text-gray-400">Your cart is empty</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= LEFT - CHECKOUT FORM ================= */}
          <div className="lg:col-span-2 bg-gray-900/60 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Customer Details</h3>

            {error && (
              <p className="bg-red-900/40 border border-red-700 text-red-400 p-3 rounded mb-4">
                {error}
              </p>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <input
                type="number"
                name="tableNumber"
                placeholder="Table Number"
                value={formData.tableNumber}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-white"
              />

              <input
                type="text"
                name="customerName"
                placeholder="Customer Name"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-white"
              />

              <input
                type="number"
                name="customerPhone"
                placeholder="Phone Number"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-white"
              />

              <input
                type="email"
                name="customerEmail"
                placeholder="Email (optional)"
                value={formData.customerEmail}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-white"
              />

              <textarea
                name="notes"
                placeholder="Order notes (optional)"
                value={formData.notes}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-white"
              />

              {/* PAYMENT METHOD */}
              <div>
                <p className="mb-2 font-medium">Payment Method</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH"
                      checked={formData.paymentMethod === 'CASH'}
                      onChange={handleChange}
                    />
                    Cash
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="RAZORPAY"
                      checked={formData.paymentMethod === 'RAZORPAY'}
                      onChange={handleChange}
                    />
                    Razorpay
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full bg-green-600 py-3 rounded-lg hover:bg-green-700 disabled:opacity-60"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>

              {success && (
                <p className="text-green-400 text-center mt-3">
                  Order placed successfully 🎉
                </p>
              )}
            </form>
          </div>

          {/* ================= RIGHT - SUMMARY ================= */}
          <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 h-fit sticky top-24">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

            <div className="space-y-3 text-gray-300">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span>{items.reduce((acc, i) => acc + i.quantity, 0)}</span>
              </div>

              <div className="flex justify-between">
                <span>Total Price</span>
                <span>₹{totalCartPrice}</span>
              </div>

              {appliedCoupan ? (
                <>
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-white border-t border-gray-700 pt-3">
                    <span>Final Amount</span>
                    <span>₹{finalAmount}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-lg font-bold text-white border-t border-gray-700 pt-3">
                  <span>Payable Amount</span>
                  <span>₹{totalCartPrice}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
