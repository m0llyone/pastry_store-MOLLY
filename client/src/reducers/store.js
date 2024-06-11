import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import productSlice from './productSlice';
import userSlice from './userSlice';

const rootReducer = combineReducers({
  products: productSlice,
  user: userSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});
