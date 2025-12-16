import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCartByUser,
    removeItemFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
} from '../redux/cartSlice';
import { Trash2, Plus, Minus } from 'lucide-react';

const Cart = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.userId);

    const { items, totalCartPrice, loading } = useSelector(
        (state) => state.cart
    );

    useEffect(() => {
        if (userId) dispatch(fetchCartByUser(userId));
    }, [dispatch, userId]);

    const handleIncrease = (menuItemId) => {
        dispatch(increaseQuantity({ userId, menuItemId }));
    };

    const handleDecrease = (menuItemId) => {
        dispatch(decreaseQuantity({ userId, menuItemId }));
    };

    const handleRemove = (menuItemId) => {
        dispatch(removeItemFromCart({ userId, menuItemId }));
    };

    const handleClearCart = () => {
        dispatch(clearCart({ userId }));
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
                                    {/* LEFT */}
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={menu.image || '/placeholder.png'}
                                            alt={menu.name}
                                            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                                        />
                                        <div>
                                            <h3 className="font-semibold">{menu.name}</h3>
                                            <p className="text-gray-400">₹{menu.price}</p>
                                        </div>
                                    </div>

                                    {/* QUANTITY */}
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

                                    {/* PRICE + REMOVE */}
                                    <div className="flex items-center justify-between md:justify-end gap-4">
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

                    {/* ================= RIGHT - CART SUMMARY ================= */}
                    <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 h-fit sticky top-24">
                        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

                        <div className="space-y-3 text-gray-300">
                            <div className="flex justify-between">
                                <span>Total Items</span>
                                <span>
                                    {items.reduce((acc, i) => acc + i.quantity, 0)}
                                </span>
                            </div>

                            <div className="flex justify-between text-lg font-bold text-white">
                                <span>Total Price</span>
                                <span>₹{totalCartPrice}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleClearCart}
                            className="mt-6 w-full bg-red-500 py-3 rounded-lg hover:bg-red-600 transition"
                        >
                            Clear Cart
                        </button>

                        <button
                            className="mt-3 w-full bg-green-600 py-3 rounded-lg hover:bg-green-700 transition"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
