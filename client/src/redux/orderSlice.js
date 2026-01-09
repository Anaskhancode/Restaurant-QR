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

/* ================= ADMIN: FETCH ALL ORDERS ================= */
export const fetchAllOrders = createAsyncThunk(
  'order/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('v1/admin/orders');
      return data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch all orders'
      );
    }
  }
);

/* ================= ADMIN: FETCH LAST 5 ORDERS ================= */
export const fetchRecentOrders = createAsyncThunk(
  'order/fetchRecentOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('v1/admin/orders/recent');
      return data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch recent orders'
      );
    }
  }
);

/* ================= ADMIN: UPDATE ORDER STATUS ================= */
export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ orderId, orderStatus }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(
        `v1/admin/orders/${orderId}/status`,
        { orderStatus }
      );
      return data.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update order status'
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

    // user orders
    orders: [],

    // admin
    allOrders: [],
    recentOrders: [],

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
      })

      /* ================= ADMIN: FETCH ALL ORDERS ================= */
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= ADMIN: FETCH RECENT ORDERS ================= */
      .addCase(fetchRecentOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.recentOrders = action.payload;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= ADMIN: UPDATE ORDER STATUS ================= */
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;

        state.allOrders = state.allOrders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );

        state.recentOrders = state.recentOrders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
