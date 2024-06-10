import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SERVER_URL } from '../data/constants';
import axios from 'axios';

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/auth`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  } catch (e) {
    localStorage.removeItem('token');
  }
});

export const fetchBasket = createAsyncThunk('user/fetchBasket', async (userId) => {
  const response = await axios.get(`${SERVER_URL}/api/cart/${userId}`);
  return response.data;
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, product, quantity, options }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/cart`, {
        userId,
        items: [{ product, quantity, options }],
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue('Ошибка при добавлении товара в корзину');
      }
    } catch (error) {
      return rejectWithValue('Ошибка сервера');
    }
  },
);

const initialState = {
  user: null,
  isAuth: false,
  isAdmin: false,
  basket: {},
  counter: 0,
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuth = true;
    },
    setRole: (state, action) => {
      state.isAdmin = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      state.counter = 0;
      state.basket = {};
      state.isAdmin = false;
      localStorage.removeItem('token');
    },
    setBasket: (state, action) => {
      state.basket = action.payload;
    },
    removeProduct: (state, action) => {
      const { id } = action.payload;
      console.log(state.basket);
      state.basket.items = state.basket.items.filter((item) => item._id !== id);
      state.counter = state.basket.items.reduce((total, item) => total + item.quantity, 0);
      state.basket.total = state.basket.items.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);
    },
    removeAllProducts: (state, action) => {
      state.basket = {};
      state.counter = 0;
    },
    setCounter: (state, action) => {
      state.counter += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchBasket.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBasket.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.basket = action.payload;
        state.counter = action.payload.items.reduce((total, item) => total + item.quantity, 0);
      })
      .addCase(fetchBasket.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addToCart.pending, (state) => {
        state.status = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = false;
        state.basket = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, setBasket, logout, removeProduct, setCounter, removeAllProducts, setRole } =
  userSlice.actions;
export default userSlice.reducer;
