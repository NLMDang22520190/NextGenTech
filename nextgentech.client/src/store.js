import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/AxiosInstance/Auth/Auth";
import cartReducer from "./features/Cart/Cart";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});
