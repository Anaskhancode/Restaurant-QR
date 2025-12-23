import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTables } from '../redux/tableSlice.js';
import { QrCode, Users, Hash } from 'lucide-react';

const AdminTables = () => {
  const dispatch = useDispatch();

  const { tables, loading, error } = useSelector((state) => state.table);

  useEffect(() => {
    dispatch(fetchAllTables());
  }, [dispatch]);

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
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold mb-6">Restaurant Tables</h1>

      {tables.length === 0 ? (
        <p className="text-gray-400">No tables found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((table) => (
            <div
              key={table._id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition"
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
                  <span>{table.qrSlug}</span>
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
