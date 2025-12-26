import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../lib/api';
/* ================= FETCH MENU ITEMS ================= */
export const fetchMenuItems = createAsyncThunk(
  'menu/fetchMenuItems',
  async (
    { category = 'All', search = '', page = 1, limit = 9 },
    thunkApi
  ) => {
    try {
      const res = await api.get('http://localhost:3000/api/v1/menu', {
        params: { category, search, page, limit },
      });

      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch menu items'
      );
    }
  }
);

/* ================= CREATE MENU ITEM ================= */
export const createMenuItem = createAsyncThunk(
  'menu/createMenuItem',
  async (menuData, thunkApi) => {
    try {
      const formData = new FormData();

      formData.append('name', menuData.name);
      formData.append('description', menuData.description);
      formData.append('price', menuData.price);
      formData.append('category', menuData.category);
      formData.append('isAvailable', menuData.isAvailable);
      formData.append('image', menuData.image);

      const res = await axios.post(
        'http://localhost:3000/api/v1/menu',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      return res.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || 'Failed to create menu item'
      );
    }
  }
);

/* ================= SLICE ================= */
const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    menuItems: [],
    categories: [],

    selectedCategory: 'All',
    searchQuery: '',

    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      limit: 9,
    },

    loading: false,
    error: null,
  },

  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.pagination.currentPage = 1; // reset page on category change
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.pagination.currentPage = 1; // reset page on search
    },

    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },

    clearMenu: (state) => {
      state.menuItems = [];
      state.categories = [];
    },
  },

  extraReducers: (builder) => {
    builder
      /* ---------- FETCH MENU ---------- */
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;

        state.menuItems = action.payload.data;
        state.categories = action.payload.categories;

        state.pagination.totalItems =
          action.payload.pagination.totalItems;
        state.pagination.totalPages =
          action.payload.pagination.totalPages;
        state.pagination.currentPage =
          action.payload.pagination.currentPage;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- CREATE MENU ---------- */
      .addCase(createMenuItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.menuItems.unshift(action.payload);
        state.pagination.totalItems += 1;
      })
      .addCase(createMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default menuSlice.reducer;

export const {
  setSelectedCategory,
  setSearchQuery,
  setCurrentPage,
  clearMenu,
} = menuSlice.actions;
