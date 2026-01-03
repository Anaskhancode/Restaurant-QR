import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../lib/api';

/* ================= CREATE ORDER ================= */
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        'v1/orders',
        orderData
      );
      return data.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Order failed'
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    loading: false,
    order: null,
    success: false,
    error: null,
  },
  reducers: {
    resetOrder(state) {
      state.loading = false;
      state.order = null;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
