import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createOrder,
  resetOrder,
  verifyPayment,
} from '../redux/orderSlice.js';
import { fetchCartByUser, clearCart } from '../redux/cartSlice.js';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const userId = useSelector((state) => state.auth.userId);
  const { items, totalCartPrice, discountAmount, finalAmount, appliedCoupan } =
    useSelector((state) => state.cart);
  const { loading, success, error } = useSelector((state) => state.order);

  const [formData, setFormData] = useState({
    tableNumber: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    notes: '',
    paymentMethod: 'CASH',
  });

  /* ================= LOAD RAZORPAY SCRIPT ================= */
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

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
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    /* ---------- CASH ---------- */
    if (formData.paymentMethod === 'CASH') {
      dispatch(createOrder(formData));
      return;
    }

    /* ---------- RAZORPAY ---------- */
    try {
      const result = await dispatch(createOrder(formData)).unwrap();

      const options = {
        key: result.razorPayOrder.key,
        amount: result.razorPayOrder.amount,
        currency: 'INR',
        order_id: result.order.razorPayOrderId,
        name: 'Elegent Bites',
        description: 'Food Order Payment',

        /* ---------- SUCCESS HANDLER ---------- */
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
            dispatch(resetOrder());
            navigate('/orders');
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },

        /* ---------- PREFILL ---------- */
        prefill: {
          name: formData.customerName,
          email: formData.customerEmail,
          contact: formData.customerPhone,
        },

        theme: { color: '#1e2939' },

        /* ---------- IF MODAL CLOSED WITHOUT PAYMENT ---------- */
        modal: {
          ondismiss: async function () {
            console.log('Razorpay closed');

            try {
              await dispatch(clearCart({ userId }));
              dispatch(resetOrder());
              toast.info('Payment cancelled. Cart cleared.');
            } catch (err) {
              console.error(err);
            }

            navigate('/orders');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error('Failed to initiate payment');
    }
  };

  /* ================= CASH SUCCESS HANDLING ================= */
  useEffect(() => {
    if (success && formData.paymentMethod === 'CASH') {
      toast.success('Order Placed Successfully!');
      dispatch(resetOrder());
      navigate('/orders');
    }
  }, [success, dispatch, navigate, formData.paymentMethod, toast]);

  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {items.length === 0 ? (
        <p className="text-gray-400">Your cart is empty</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
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
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                name="customerName"
                placeholder="Customer Name"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
              <input
                type="number"
                name="customerPhone"
                placeholder="Phone Number"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
              <input
                type="email"
                name="customerEmail"
                placeholder="Email (optional)"
                value={formData.customerEmail}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
              <textarea
                name="notes"
                placeholder="Order notes (optional)"
                value={formData.notes}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />

              {/* PAYMENT */}
              <div>
                <p className="mb-2 font-medium">Payment Method</p>
                <div className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH"
                      checked={formData.paymentMethod === 'CASH'}
                      onChange={handleChange}
                    />{' '}
                    Cash
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Razorpay"
                      checked={formData.paymentMethod === 'Razorpay'}
                      onChange={handleChange}
                    />{' '}
                    Razorpay
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 py-3 rounded-lg hover:bg-green-700 disabled:opacity-60"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* RIGHT */}
          <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 h-fit">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

            <div className="space-y-3 text-gray-300">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span>{items.reduce((a, i) => a + i.quantity, 0)}</span>
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
                  <div className="flex justify-between text-lg font-bold border-t pt-3">
                    <span>Final Amount</span>
                    <span>₹{finalAmount}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-lg font-bold border-t pt-3">
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
