import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/api';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('v1/admin/dashboard-stats');
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load dashboard stats'
      );
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',

  initialState: {
    loading: false,
    stats: {
      totalOrders: 0,
      totalRevenue: 0,
      totalMenuItems: 0,
      totalTables: 0,
      totalActiveCoupans: 0,   // 👈 NEW
    },
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
