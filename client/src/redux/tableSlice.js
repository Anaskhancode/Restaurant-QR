import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../lib/api';
const API_URL = 'http://localhost:3000/api/v1';
console.log(api);

/* =======================
   ASYNC THUNKS
======================= */

// ➕ Create Table (Admin)
export const createTable = createAsyncThunk(
  'tables/createTable',
  async (tableData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/tables`, tableData);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create table');
    }
  }
);

// 📥 Get All Tables (Admin)
export const fetchAllTables = createAsyncThunk(
  'tables/fetchAllTables',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.get(`${API_URL}/tables`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tables');
    }
  }
);

// 🔍 Get Table By QR Slug (Customer)
export const fetchTableBySlug = createAsyncThunk(
  'tables/fetchTableBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/tables/${slug}`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid QR Code');
    }
  }
);

/* =======================
   SLICE
======================= */

const tableSlice = createSlice({
  name: 'tables',
  initialState: {
    tables: [],
    currentTable: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearCurrentTable: (state) => {
      state.currentTable = null;
    },
    clearTableError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Create Table
      .addCase(createTable.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTable.fulfilled, (state, action) => {
        state.loading = false;
        state.tables.push(action.payload);
      })
      .addCase(createTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All Tables
      .addCase(fetchAllTables.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTables.fulfilled, (state, action) => {
        state.loading = false;
        state.tables = action.payload;
      })
      .addCase(fetchAllTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Table By Slug
      .addCase(fetchTableBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTableBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTable = action.payload;
      })
      .addCase(fetchTableBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentTable , clearTableError } = tableSlice.actions;
export default tableSlice.reducer;
