import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1/cart';

/* ================= GET CART BY USER ================= */
export const fetchCartByUser = createAsyncThunk(
  'cart/fetchCartByUser',
  async (userId, thunkApi) => {
    try {
      const res = await axios.get(`${BASE_URL}/${userId}`);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cart'
      );
    }
  }
);

/* ================= ADD ================= */
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, menuItemId, quantity = 1 }, thunkApi) => {
    try {
      const res = await axios.post(`${BASE_URL}/addtocart`, {
        userId,
        menuItemId,
        quantity,
      });
      return res.data.cart;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || 'Failed to add item to cart'
      );
    }
  }
);

/* ================= REMOVE ================= */
export const removeItemFromCart = createAsyncThunk(
  'cart/removeItemFromCart',
  async ({ userId, menuItemId }, thunkApi) => {
    try {
      const res = await axios.post(`${BASE_URL}/remove`, { userId, menuItemId });
      return res.data.cart;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || 'Failed to remove item'
      );
    }
  }
);

/* ================= INCREASE ================= */
export const increaseQuantity = createAsyncThunk(
  'cart/increaseQuantity',
  async ({ userId, menuItemId }, thunkApi) => {
    try {
      const res = await axios.post(`${BASE_URL}/increase`, { userId, menuItemId });
      return res.data.cart;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || 'Failed to increase quantity'
      );
    }
  }
);

/* ================= DECREASE ================= */
export const decreaseQuantity = createAsyncThunk(
  'cart/decreaseQuantity',
  async ({ userId, menuItemId }, thunkApi) => {
    try {
      const res = await axios.post(`${BASE_URL}/decrease`, { userId, menuItemId });
      return res.data.cart;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || 'Failed to decrease quantity'
      );
    }
  }
);

/* ================= CLEAR ================= */
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async ({ userId }, thunkApi) => {
    try {
      await axios.post(`${BASE_URL}/clear`, { userId });
      return { items: [], totalCartPrice: 0 };
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || 'Failed to clear cart'
      );
    }
  }
);

/* ================= SLICE ================= */
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    items: [],
    totalCartPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {
    resetCart: (state) => {
      state.cart = null;
      state.items = [];
      state.totalCartPrice = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* FETCH CART */
      .addCase(fetchCartByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.items = action.payload?.items || [];
        state.totalCartPrice = action.payload?.totalCartPrice || 0;
      })
      .addCase(fetchCartByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ADD */
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.items = action.payload?.items || [];
        state.totalCartPrice = action.payload?.totalCartPrice || 0;
      })

      /* REMOVE */
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.items = action.payload?.items || [];
        state.totalCartPrice = action.payload?.totalCartPrice || 0;
      })

      /* INCREASE */
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.items = action.payload?.items || [];
        state.totalCartPrice = action.payload?.totalCartPrice || 0;
      })

      /* DECREASE */
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.items = action.payload?.items || [];
        state.totalCartPrice = action.payload?.totalCartPrice || 0;
      })

      /* CLEAR */
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = null;
        state.items = [];
        state.totalCartPrice = 0;
      });
  },
});

export default cartSlice.reducer;
export const { resetCart } = cartSlice.actions;
