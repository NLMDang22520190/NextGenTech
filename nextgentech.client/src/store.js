import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/AxiosInstance/Auth/Auth';

export const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });