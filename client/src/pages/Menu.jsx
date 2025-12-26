import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMenuItems,
  setSelectedCategory,
  createMenuItem,
} from '../redux/menuSlice';

const AdminMenu = () => {
  const dispatch = useDispatch();

  const {
    menuItems,
    categories,
    selectedCategory,
    loading,
    error,
    pagination,
    searchQuery,
  } = useSelector((state) => state.menu);

  // 🔑 LOCAL pagination state (matches your slice)
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isAvailable: true,
    image: null,
  });

  const inputClass =
    'bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-white';

  /* ================= FETCH MENU ================= */
  useEffect(() => {
    dispatch(
      fetchMenuItems({
        category: selectedCategory,
        search: searchQuery,
        page,
      })
    );
  }, [dispatch, selectedCategory, searchQuery, page]);

  /* ================= HANDLERS ================= */
  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
    setPage(1); // reset page
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createMenuItem(form)).then(() => {
      setForm({
        name: '',
        description: '',
        price: '',
        category: '',
        isAvailable: true,
        image: null,
      });
      setPage(1);
    });
  };

  /* ================= PAGINATION ================= */
  const Pagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    return (
      <div className="flex justify-center gap-2 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-40"
        >
          Prev
        </button>

        {[...Array(pagination.totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? 'bg-white text-black'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {/* ================= ADD MENU ITEM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/60 border border-gray-800 rounded-xl p-6"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">
          Add New Menu Item
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Item Name"
            required
            className={inputClass}
          />

          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            required
            className={inputClass}
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            required
            className={inputClass}
          />

          <select
            name="isAvailable"
            value={form.isAvailable}
            onChange={(e) =>
              setForm({ ...form, isAvailable: e.target.value === 'true' })
            }
            className={inputClass}
          >
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows="3"
            required
            className={`${inputClass} md:col-span-2`}
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-200"
          >
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </form>

      {/* ================= MENU LIST ================= */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">All Menu Items</h2>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedCategory === category
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-44 w-full object-cover"
              />

              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="text-white font-semibold">{item.name}</h3>
                  <span className="text-white font-bold">₹{item.price}</span>
                </div>

                <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                  {item.description}
                </p>

               <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 uppercase">{item.category}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      item.isAvailable
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination />
      </div>
    </div>
  );
};

export default AdminMenu;
