import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../lib/api';

/* =======================
   API BASE CONFIG
======================= */
const API_URL = "http://localhost:3000/api/v1";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
});

/* =======================
   THUNKS
======================= */

// ✅ Get all coupans (user)
export const fetchCoupans = createAsyncThunk(
  'coupans/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/coupans`, authHeader());
      return res.data.CoupansAfterCalculation;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch coupans'
      );
    }
  }
);

// ✅ Register coupan (admin)
export const registerCoupan = createAsyncThunk(
  'coupans/register',
  async (coupanData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/coupans`,
        coupanData,
        authHeader()
      );
      return res.data.coupan;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to register coupan'
      );
    }
  }
);

// ✅ APPLY COUPAN
export const applyCoupan = createAsyncThunk(
  'coupans/apply',
  async ({ code, discountAmount }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        `${API_URL}/applyCoupan`,
        { code, discountAmount },
        authHeader()
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to apply coupan'
      );
    }
  }
);

/* =======================
   SLICE
======================= */

const coupanSlice = createSlice({
  name: 'coupans',
  initialState: {
    coupans: [],
    appliedCoupan: null,   // 👈 new
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearCoupanState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.appliedCoupan = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ===== FETCH COUPANS ===== */
      .addCase(fetchCoupans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupans.fulfilled, (state, action) => {
        state.loading = false;
        state.coupans = action.payload;
      })
      .addCase(fetchCoupans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== REGISTER COUPAN ===== */
      .addCase(registerCoupan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerCoupan.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.coupans.push(action.payload);
      })
      .addCase(registerCoupan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== APPLY COUPAN ===== */
      .addCase(applyCoupan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCoupan.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupan = action.payload;
      })
      .addCase(applyCoupan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCoupanState } = coupanSlice.actions;
export default coupanSlice.reducer;
