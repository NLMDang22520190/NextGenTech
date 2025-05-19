import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../AxiosInstance/AxiosInstance";

const apiBaseUrl = "/api/Promotion";

export const fetchAllPromotion = createAsyncThunk(
    "promotion/fetchAllPromotion",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`${apiBaseUrl}/AdminGetAllPromotion`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const addPromotion = createAsyncThunk(
    "promotion/addPromotion",
    async (promotionData, { rejectWithValue }) => {
        try {
            const response = await api.post(`${apiBaseUrl}/AddPromotion`, promotionData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const updatePromotion = createAsyncThunk(
    "promotion/updatePromotion",
    async (promotionData, { rejectWithValue }) => {
        try {
            const response = await api.put(`${apiBaseUrl}/UpdatePromotion/${promotionData.promotionId}`, promotionData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const deletePromotion = createAsyncThunk(
    "promotion/deletePromotion",
    async (promotionId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`${apiBaseUrl}/DeletePromotion/${promotionId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

const initialState = {
    promotionItems: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
}

const promotionSlice = createSlice({
    name: "promotion",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPromotion.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllPromotion.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.promotionItems = action.payload;
            })
            .addCase(fetchAllPromotion.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(addPromotion.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addPromotion.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.promotionItems.push(action.payload);
            })
            .addCase(addPromotion.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(updatePromotion.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updatePromotion.fulfilled, (state, action) => {
                state.status = "succeeded";
                const index = state.promotionItems.findIndex(promotion => promotion.promotionId === action.payload.promotionId);
                if (index !== -1) {
                    state.promotionItems[index] = action.payload;
                }
            })
            .addCase(updatePromotion.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(deletePromotion.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deletePromotion.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.promotionItems = state.promotionItems.filter(promotion => promotion.promotionId !== action.payload.promotionId);
            })
            .addCase(deletePromotion.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default promotionSlice.reducer;