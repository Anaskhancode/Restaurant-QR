import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTables, createTable, clearTableError } from '../redux/tableSlice.js';
import { QrCode, Users, Hash, Plus } from 'lucide-react';

const AdminTables = () => {
  const dispatch = useDispatch();

  const { tables, loading, error } = useSelector((state) => state.table);

  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('');

  useEffect(() => {
    dispatch(clearTableError())
    dispatch(fetchAllTables());
    
  }, [dispatch]);

  const handleCreateTable = async (e) => {
    e.preventDefault();

    if (!tableNumber) return;

    await dispatch(
      createTable({
        tableNumber,
        capacity,
      })
    );

    // re-fetch to stay fully in sync
    dispatch(fetchAllTables());

    setTableNumber('');
    setCapacity('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-white">
        Loading tables...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 text-white max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Restaurant Tables</h1>

      {/* ================= ADD TABLE FORM ================= */}
      <form
        onSubmit={handleCreateTable}
        className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8
                   flex flex-col sm:flex-row gap-4"
      >
        <input
          type="number"
          placeholder="Table Number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="bg-gray-800 px-4 py-2 rounded outline-none text-white"
          required
        />

        <input
          type="number"
          placeholder="Capacity (optional)"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="bg-gray-800 px-4 py-2 rounded outline-none text-white"
        />

        <button
          type="submit"
          className="flex items-center justify-center gap-2
                     bg-green-600 px-6 py-2 rounded
                     hover:bg-green-700 transition"
        >
          <Plus size={16} />
          Add Table
        </button>
      </form>

      {/* ================= TABLE LIST ================= */}
      {tables.length === 0 ? (
        <p className="text-gray-400">No tables found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((table) => (
            <div
              key={table._id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5
                         hover:border-gray-600 transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">
                  Table #{table.tableNumber}
                </h2>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    table.isActive
                      ? 'bg-green-600/20 text-green-400'
                      : 'bg-red-600/20 text-red-400'
                  }`}
                >
                  {table.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* QR Image */}
              <div className="flex justify-center mb-4">
                <img
                  src={table.qrImage}
                  alt={`QR Table ${table.tableNumber}`}
                  className="w-32 h-32 object-contain bg-white p-2 rounded"
                />
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Hash size={16} />
                  <span className="break-all">{table.qrSlug}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>Capacity: {table.capacity || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <QrCode size={16} />
                  <a
                    href={table.qrCodeURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline break-all"
                  >
                    QR URL
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTables;
