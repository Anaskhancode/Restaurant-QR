import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/api';

/* ================= CREATE ORDER ================= */
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('v1/orders', orderData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Order failed'
      );
    }
  }
);

/* ================= VERIFY PAYMENT ================= */
export const verifyPayment = createAsyncThunk(
  'order/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('v1/verify/payment', paymentData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Payment verification failed'
      );
    }
  }
);

/* ================= FETCH USER ORDERS ================= */
export const fetchOrdersOfUser = createAsyncThunk(
  'order/fetchOrdersOfUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('v1/my-orders');
      return data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch orders'
      );
    }
  }
);

/* ================= FETCH RAZORPAY ORDER ================= */
export const fetchRazorpayOrder = createAsyncThunk(
  'order/fetchRazorpayOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/v1/orders/${orderId}/razorpay`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch Razorpay order'
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    loading: false,

    // single order
    order: null,
    razorPayOrder: null,

    // all user orders
    orders: [],

    success: false,
    paymentVerified: false,
    error: null,
  },

  reducers: {
    resetOrder(state) {
      state.loading = false;
      state.order = null;
      state.razorPayOrder = null;
      state.success = false;
      state.paymentVerified = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ================= CREATE ORDER ================= */
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload.order;
        state.razorPayOrder = action.payload.razorPayOrder || null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= VERIFY PAYMENT ================= */
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.loading = false;
        state.paymentVerified = true;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= FETCH USER ORDERS ================= */
      .addCase(fetchOrdersOfUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersOfUser.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersOfUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= FETCH RAZORPAY ORDER ================= */
      .addCase(fetchRazorpayOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRazorpayOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.razorPayOrder = action.payload.razorPayOrder;
        state.order = action.payload.order;
      })
      .addCase(fetchRazorpayOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
