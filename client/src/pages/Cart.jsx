import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchCartByUser,
  removeItemFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from '../redux/cartSlice';
import { fetchCoupans, applyCoupan } from '../redux/coupanSlice';
import { Trash2, Plus, Minus } from 'lucide-react';

const Cart = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);

  const {
    items,
    totalCartPrice,
    loading,
    appliedCoupan,
    discountAmount,
    finalAmount,
  } = useSelector((state) => state.cart);

  const { coupans } = useSelector((state) => state.coupan);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (userId) {
      dispatch(fetchCartByUser(userId));
      dispatch(fetchCoupans());
    }
  }, [dispatch, userId]);

  /* ================= CART ACTIONS ================= */
  const handleIncrease = async (menuItemId) => {
    await dispatch(increaseQuantity({ userId, menuItemId }));
    dispatch(fetchCartByUser(userId));
    dispatch(fetchCoupans());
  };

  const handleDecrease = async (menuItemId) => {
    await dispatch(decreaseQuantity({ userId, menuItemId }));
    dispatch(fetchCartByUser(userId));
    dispatch(fetchCoupans());
  };

  const handleRemove = async (menuItemId) => {
    await dispatch(removeItemFromCart({ userId, menuItemId }));
    dispatch(fetchCartByUser(userId));
    dispatch(fetchCoupans());
  };

  const handleClearCart = async () => {
    await dispatch(clearCart({ userId }));
    dispatch(fetchCartByUser(userId));
    dispatch(fetchCoupans());
  };

  /* ================= APPLY COUPAN ================= */
  const handleApplyCoupan = async (coupan) => {
    await dispatch(
      applyCoupan({
        code: coupan.code,
        discountAmount: coupan.discountAmount,
      })
    );

    dispatch(fetchCartByUser(userId));
  };

  if (loading) {
    return <p className="text-center mt-10 text-white">Loading cart...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      {!items || items.length === 0 ? (
        <p className="text-gray-400">Your cart is empty</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= LEFT - CART ITEMS ================= */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => {
              const menu = item.menuItem || {};

              return (
                <div
                  key={menu._id || index}
                  className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between
                  p-4 rounded-xl bg-gray-900/60 border border-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={menu.image || '/placeholder.png'}
                      alt={menu.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold">{menu.name}</h3>
                      <p className="text-gray-400">₹{menu.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleDecrease(menu._id)}
                      className="p-1 border rounded"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="font-semibold">{item.quantity}</span>

                    <button
                      onClick={() => handleIncrease(menu._id)}
                      className="p-1 border rounded"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="font-semibold">
                      ₹{menu.price * item.quantity}
                    </p>

                    <button
                      onClick={() => handleRemove(menu._id)}
                      className="text-red-500"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= RIGHT - COUPANS + SUMMARY ================= */}
          <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 h-fit sticky top-24 space-y-6">

            {/* ================= COUPANS ================= */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Available Coupons</h4>

              <div className="space-y-3">
                {coupans.map((coupan) => {
                  const isApplied = appliedCoupan === coupan.code;

                  return (
                    <div
                      key={coupan._id}
                      className={`p-3 rounded-lg border
                        ${coupan.isAvailable
                          ? 'border-green-600 bg-green-900/20'
                          : 'border-gray-700 bg-gray-800/40 opacity-60'}
                      `}
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold">{coupan.code}</p>
                          <p className="text-sm text-gray-400">
                            {coupan.description}
                          </p>
                          <p className="text-sm mt-1">
                            Save ₹{coupan.discountAmount}
                          </p>
                          <p className="text-sm mt-1">
                             Coupon expires at:{' '}
                              {new Date(coupan.validTo)
                              .toLocaleString('en-IN', 
                              { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', })} 
                              </p>
                        </div>

                        <button
                          disabled={!coupan.isAvailable || appliedCoupan}
                          onClick={() => handleApplyCoupan(coupan)}
                          className={`px-3 py-1 text-sm rounded-md
                            ${isApplied
                              ? 'bg-green-700 cursor-default'
                              : coupan.isAvailable && !appliedCoupan
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-gray-600 cursor-not-allowed'}
                          `}
                        >
                          {isApplied ? 'Applied' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ================= ORDER SUMMARY ================= */}
            <div>
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
                      <span>Applied Coupon</span>
                      <span>{appliedCoupan}</span>
                    </div>

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
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>Payable Amount</span>
                    <span>₹{totalCartPrice}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ================= ACTIONS ================= */}
            <button
              onClick={handleClearCart}
              className="w-full bg-red-500 py-3 rounded-lg hover:bg-red-600"
            >
              Clear Cart
            </button>
            <Link to={'/checkout'} className='block'>
            <button className="w-full bg-green-600 py-3 rounded-lg hover:bg-green-700">
              Checkout
            </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
