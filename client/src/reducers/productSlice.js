import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SERVER_URL } from '../data/constants';
import axios from 'axios';

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchProducts = createAsyncThunk('products/fetchAllProducts', async () => {
  const response = await axios.get(`${SERVER_URL}/api/products`, {
    params: { all: true },
    headers: getAuthHeader(),
  });
  return response.data.products;
});

export const fetchPaginatedProducts = createAsyncThunk(
  'products/fetchPaginatedProducts',
  async ({ page, category, title }) => {
    const limit = 10;
    const response = await axios.get(`${SERVER_URL}/api/products`, {
      params: { page, limit, category, title },
      headers: getAuthHeader(),
    });
    return response.data;
  },
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    pagination: {
      count: 0,
      pageCount: 0,
      currentPage: 1,
    },
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchPaginatedProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPaginatedProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPaginatedProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
