import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../AxiosInstance/AxiosInstance";

const apiBaseUrl = "/api/Brand";

export const fetchAllBrand = createAsyncThunk(
    "brand/fetchAllBrand",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`${apiBaseUrl}/AdminGetAllBrand`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const addBrand = createAsyncThunk(
    "brand/addBrand",
    async (brandData, { rejectWithValue }) => {
        try {
            const response = await api.post(`${apiBaseUrl}/AddBrand`, brandData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const updateBrand = createAsyncThunk(
    "brand/updateBrand",
    async (brandData, { rejectWithValue }) => {
        try {
            const response = await api.put(`${apiBaseUrl}/UpdateBrand/${brandData.brandId}`, brandData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const deleteBrand = createAsyncThunk(
    "brand/deleteBrand",
    async (brandId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`${apiBaseUrl}/DeleteBrand/${brandId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

const initialState = {
    brandItems: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
}

const brandSlice = createSlice({
    name: "brand",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllBrand.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllBrand.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.brandItems = action.payload;
            })
            .addCase(fetchAllBrand.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(addBrand.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addBrand.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.brandItems.push(action.payload);
            })
            .addCase(addBrand.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(deleteBrand.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteBrand.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.brandItems = state.brandItems.filter(brand => brand.brandId !== action.payload.brandId);
            })
            .addCase(deleteBrand.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default brandSlice.reducer;




