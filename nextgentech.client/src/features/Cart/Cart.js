import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../AxiosInstance/AxiosInstance";
import { useSelector } from "react-redux";

// URL API base
const apiBaseUrl = "/api/Cart";
//const userId = useSelector((state) => state.auth.user);

export const fetchCartIdByCustomerId = createAsyncThunk(
  "cart/fetchCartIdByCustomerId",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${apiBaseUrl}/GetCartIdByCustomerId/${customerId}`
      );
      return response.data; // API trả về cartId
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Async thunk để lấy dữ liệu giỏ hàng theo CustomerId
export const fetchCartDetailsByCustomerId = createAsyncThunk(
  "cart/fetchCartDetailsByCustomerId",
  async (customerId, { dispatch, getState, rejectWithValue }) => {
    try {
      // Gọi API để lấy cartId trước
      const cartIdResponse = await dispatch(
        fetchCartIdByCustomerId(customerId)
      ).unwrap();
      const cartId = cartIdResponse; // Lưu cartId

      // Gọi API để lấy chi tiết giỏ hàng
      const response = await api.get(
        `${apiBaseUrl}/GetCartDetailsByCustomerId/${customerId}`
      );
      return { cartId, items: response.data }; // Trả về cả cartId và items
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Async actions (API calls)
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async (itemData, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await api.post(`${apiBaseUrl}/AddItemToCart`, itemData);
      const userId = getState().auth.user; // Lấy userId từ state Redux
      // Gọi lại fetchCartDetailsByCustomerId để cập nhật giỏ hàng
      await dispatch(fetchCartDetailsByCustomerId(userId));
      return response.data; // API trả về item vừa thêm
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);
export const updateItemInCart = createAsyncThunk(
  "cart/updateItemInCart",
  async (updateData, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${apiBaseUrl}/UpdateItemInCart`,
        updateData
      );
      return response.data; // API trả về item sau khi cập nhật
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const deleteItemFromCart = createAsyncThunk(
  "cart/deleteItemFromCart",
  async (cartDetailId, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `${apiBaseUrl}/DeleteItemFromCart/${cartDetailId}`
      );
      const userId = getState().auth.user; // Lấy userId từ state Redux
      // Gọi lại fetchCartDetailsByCustomerId để cập nhật giỏ hàng
      await dispatch(fetchCartDetailsByCustomerId(userId));
      return cartDetailId; // Trả về ID của item vừa bị xóa
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Initial state
const initialState = {
  cartId: null, // Lưu trữ cartId
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart(state) {
      state.cartId = null;
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch cartId
    builder
      .addCase(fetchCartIdByCustomerId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartIdByCustomerId.fulfilled, (state, action) => {
        state.cartId = action.payload; // Cập nhật cartId vào state
        state.status = "succeeded";
      })
      .addCase(fetchCartIdByCustomerId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
    // Fetch cart details
    builder
      .addCase(fetchCartDetailsByCustomerId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartDetailsByCustomerId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartId = action.payload.cartId; // Đảm bảo cartId được cập nhật
        state.items = action.payload.items; // Cập nhật items
      })
      .addCase(fetchCartDetailsByCustomerId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Add item to cart
    builder
      .addCase(addItemToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        //state.items.push(action.payload); // Thêm item vào state
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Update item in cart
    builder
      .addCase(updateItemInCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateItemInCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedItem = action.payload;
        const index = state.items.findIndex(
          (item) => item.cartDetailId === updatedItem.cartDetailId
        );
        if (index !== -1) {
          state.items[index] = updatedItem; // Cập nhật item
        }
      })
      .addCase(updateItemInCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Delete item from cart
    builder
      .addCase(deleteItemFromCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteItemFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        const cartDetailId = action.payload;
        state.items = state.items.filter(
          (item) => item.cartDetailId !== cartDetailId
        ); // Xóa item khỏi state
      })
      .addCase(deleteItemFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearCart } = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;
