import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMenuItems, setSelectedCategory } from '../redux/menuSlice';
import Hero from '../components/Hero';
import { addToCart } from '../redux/cartSlice';
import { useToast } from '../context/ToastContext';
import { useSocket } from '../context/SocketContext';

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden animate-pulse"
      >
        <div className="h-48 bg-gray-800/50" />
        <div className="p-4 space-y-3">
          <div className="h-5 w-32 bg-gray-800/50 rounded" />
          <div className="h-4 w-full bg-gray-800/50 rounded" />
          <div className="h-4 w-3/4 bg-gray-800/50 rounded" />
        </div>
      </div>
    ))}
  </div>
);

const Homepage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const socket = useSocket();
  const {
    menuItems,
    categories,
    loading,
    error,
    selectedCategory,
    searchQuery,
    pagination,
  } = useSelector((state) => state.menu);

  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
  if (!socket || !userId) return;

  socket.emit("join-room", userId);

  socket.on("order-status-update", (data) => {
    toast.success(`Your order is now ${data.orderStatus}`);
  });

  return () => socket.off("order-status-update");

}, [socket, userId]); // keep only these




  /* ================= FETCH MENU ================= */
  useEffect(() => {
    dispatch(
      fetchMenuItems({
        category: selectedCategory,
        search: searchQuery, // 🔥 comes from NAVBAR
        page: pagination.currentPage,
        limit: 9,
      })
    );
  }, [dispatch, selectedCategory, searchQuery, pagination.currentPage]);

  /* ================= HANDLERS ================= */
  const handleAddToCart = (item) => {
    if (!userId) {
      toast.success('Please be a member first');
      return;
    }

    dispatch(
      addToCart({
        userId,
        menuItemId: item._id,
        quantity: 1,
      })
    );
  };

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
  };

  /* ================= UI STATES ================= */
  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() =>
            dispatch(
              fetchMenuItems({
                category: selectedCategory,
                search: searchQuery,
                page: pagination.currentPage,
                limit: 9,
              })
            )
          }
          className="mt-4 px-4 py-2 bg-white text-black rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <Hero />

      <div id="menu-section" className="space-y-8 pt-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Our Menu</h1>
          <p className="text-gray-400">
            Discover our delicious vegetarian offerings
          </p>
        </div>

        {/* ================= CATEGORIES ================= */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedCategory === category
                  ? 'bg-white text-black'
                  : 'bg-gray-800/50 text-gray-300 border border-gray-700/50'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* ================= MENU GRID ================= */}
        {menuItems.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-white">
              No items found
            </h3>
            <p className="text-gray-400 text-sm">
              Try a different search or category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {!item.isAvailable && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                      Unavailable
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-white font-semibold">{item.name}</h3>
                    <span className="text-white font-bold">₹{item.price}</span>
                  </div>

                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                    {item.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 uppercase">
                      {item.category}
                    </span>
                    <button
                      disabled={!item.isAvailable}
                      onClick={() => handleAddToCart(item)}
                      className={`px-4 py-2 rounded-lg text-sm ${item.isAvailable
                        ? 'bg-white text-black'
                        : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        }`}
                    >
                      {item.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= PAGINATION ================= */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-10">
            <button
              disabled={pagination.currentPage === 1}
              onClick={() => {
                dispatch(
                  fetchMenuItems({
                    category: selectedCategory,
                    search: searchQuery,
                    page: pagination.currentPage - 1,
                    limit: 9,
                  })
                )
                // scroll to top
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-gray-400 text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              disabled={
                pagination.currentPage === pagination.totalPages
              }
              onClick={() => {
                dispatch(
                  fetchMenuItems({
                    category: selectedCategory,
                    search: searchQuery,
                    page: pagination.currentPage + 1,
                    limit: 9,
                  })
                )
                // scroll to top
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
