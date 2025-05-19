import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../AxiosInstance/AxiosInstance";

const apiBaseUrl = "/api/Product";

export const fetchAllProduct = createAsyncThunk(
    "product/fetchAllProduct",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`${apiBaseUrl}/AdminGetAllProduct`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const addProduct = createAsyncThunk(
    "product/addProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const response = await api.post(`${apiBaseUrl}/AddProduct`, productData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const updateProduct = createAsyncThunk(
    "product/updateProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const response = await api.put(`${apiBaseUrl}/UpdateProduct/${productData.productId}`, productData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "product/deleteProduct",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`${apiBaseUrl}/DeleteProduct/${productId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const fetchProductDetail = createAsyncThunk(
    "product/fetchProductDetail",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await api.get(`${apiBaseUrl}/AdminGetProductById/${productId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

const initialState = {
    productItems: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProduct.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllProduct.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.productItems = action.payload;
            })
            .addCase(fetchAllProduct.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(addProduct.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.productItems.push(action.payload);
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(updateProduct.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.status = "succeeded";
                const index = state.productItems.findIndex(product => product.productId === action.payload.productId);
                if (index !== -1) {
                    state.productItems[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(deleteProduct.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.productItems = state.productItems.filter(product => product.productId !== action.payload.productId);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(fetchProductDetail.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchProductDetail.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.productDetail = action.payload;
            })
            .addCase(fetchProductDetail.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default productSlice.reducer;