import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoupans, registerCoupan, clearCoupanState } from '../redux/coupanSlice';

const AdminCoupan = () => {
  const dispatch = useDispatch();

  const { coupans, loading, error, success } = useSelector(
    (state) => state.coupan
  );

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    maxDiscount: '',
    minOrderAmount: '',
    validFrom: '',
    validTo: '',
    discountValue: '',
    description: '',
  });

  useEffect(() => {
    dispatch(fetchCoupans());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setFormData({
        code: '',
        discountType: 'percentage',
        maxDiscount: '',
        minOrderAmount: '',
        validFrom: '',
        validTo: '',
        discountValue: '',
        description: '',
      });
      dispatch(clearCoupanState());
      dispatch(fetchCoupans());
    }
  }, [success, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerCoupan(formData));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 text-white space-y-10">
      <h2 className="text-2xl font-bold">Admin Coupons</h2>

     {/* ================= ADD COUPAN ================= */}
<div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 md:p-8">
  
  {/* HEADER */}
  <div className="mb-6">
    <h3 className="text-2xl font-semibold flex items-center gap-2">
      🎟️ Add New Coupon
    </h3>
    <p className="text-gray-400 text-sm mt-1">
      Create a new coupon for discounts & offers
    </p>
  </div>

  {/* FORM */}
  <form
    onSubmit={handleSubmit}
    className="grid grid-cols-1 md:grid-cols-2 gap-5"
  >
    {/* Coupon Code */}
    <div>
      <label className="block text-sm text-gray-300 mb-1">
        Coupon Code
      </label>
      <input
        name="code"
        value={formData.code}
        onChange={handleChange}
        placeholder="EX: SAVE50"
        required
        className="input uppercase tracking-wider"
      />
    </div>

    {/* Discount Type */}
    <div>
      <label className="block text-sm text-gray-300 mb-1">
        Discount Type
      </label>
      <select
        name="discountType"
        value={formData.discountType}
        onChange={handleChange}
        className="input"
      >
        <option value="percentage">Percentage (%)</option>
        <option value="fixedAmount">Fixed Amount (₹)</option>
      </select>
    </div>

    {/* Discount Value */}
    <div>
      <label className="block text-sm text-gray-300 mb-1">
        Discount Value
      </label>
      <input
        name="discountValue"
        value={formData.discountValue}
        onChange={handleChange}
        placeholder="EX: 20 or 100"
        required
        className="input"
      />
    </div>

    {/* Max Discount */}
    <div>
      <label className="block text-sm text-gray-300 mb-1">
        Max Discount <span className="text-gray-500">(optional)</span>
      </label>
      <input
        name="maxDiscount"
        value={formData.maxDiscount}
        onChange={handleChange}
        placeholder="EX: 500"
        className="input"
      />
    </div>

    {/* Min Order Amount */}
    <div>
      <label className="block text-sm text-gray-300 mb-1">
        Minimum Order Amount
      </label>
      <input
        name="minOrderAmount"
        value={formData.minOrderAmount}
        onChange={handleChange}
        placeholder="EX: 999"
        className="input"
      />
    </div>

    {/* Valid From */}
    <div>
      <label className="block text-sm text-gray-300 mb-1">
        Valid From
      </label>
      <input
        type="date"
        name="validFrom"
        value={formData.validFrom}
        onChange={handleChange}
        className="input"
      />
    </div>

    {/* Valid To */}
    <div>
      <label className="block text-sm text-gray-300 mb-1">
        Valid Till
      </label>
      <input
        type="date"
        name="validTo"
        value={formData.validTo}
        onChange={handleChange}
        className="input"
      />
    </div>

    {/* Description */}
    <div className="md:col-span-2">
      <label className="block text-sm text-gray-300 mb-1">
        Description
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="EX: Flat 20% off on first order"
        className="input min-h-[90px]"
      />
    </div>

    {/* SUBMIT */}
    <button
      type="submit"
      className="md:col-span-2 mt-2 bg-green-600 py-3 rounded-xl font-semibold
      hover:bg-green-700 transition active:scale-[0.98]"
    >
      ➕ Add Coupon
    </button>
  </form>

  {/* ERROR */}
  {error && (
    <p className="text-red-400 mt-4 text-sm">
      {error}
    </p>
  )}
</div>


      {/* ================= ALL COUPANS ================= */}
      <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">All Coupons</h3>

        {loading ? (
          <p className="text-gray-400">Loading coupons...</p>
        ) : coupans.length === 0 ? (
          <p className="text-gray-400">No coupons found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="py-2">Code</th>
                  <th>Discount</th>
                  <th>Min Order</th>
                  <th>Valid Till</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {coupans.map((c) => (
                  <tr key={c._id} className="border-b border-gray-800">
                    <td className="py-2 font-semibold">{c.code}</td>
                    <td>
                      {c.discountType === 'percentage'
                        ? `₹${c.discountValue}`
                        : `₹${c.discountValue}`}
                    </td>
                    <td>₹{c.minOrderAmount}</td>
                    <td>
                      {c.validTo
                        ? new Date(c.validTo).toLocaleDateString('en-IN')
                        : 'No Expiry'}
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs
                          ${c.isAvailable
                            ? 'bg-green-600'
                            : 'bg-red-600'}
                        `}
                      >
                        {c.isAvailable ? 'Active' : 'Inactive'}
                      </span>
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

export default AdminCoupan;
