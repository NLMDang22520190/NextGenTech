import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/AxiosInstance/Auth/Auth";
import cartReducer from "./features/Cart/Cart";
import brandReducer from "./features/Admin/Brands/Brand";
import productReducer from "./features/Admin/Products/Product";
import promotionReducer from "./features/Admin/Promotions/Promotion";
import categoryReducer from "./features/Admin/Categories/Category";
import userReducer from "./features/Admin/Users/User";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    brand: brandReducer,
    product: productReducer,
    promotion: promotionReducer,
    category: categoryReducer,
    user: userReducer,
  },
});
