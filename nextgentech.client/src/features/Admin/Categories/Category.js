import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../AxiosInstance/AxiosInstance";

const apiBaseUrl = "/api/Category";

export const fetchAllCategory = createAsyncThunk(
    "category/fetchAllCategory",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`${apiBaseUrl}/AdminGetAllCategory`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const addCategory = createAsyncThunk(
    "category/addCategory",
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await api.post(`${apiBaseUrl}/AddCategory`, categoryData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const updateCategory = createAsyncThunk(
    "category/updateCategory",
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await api.put(`${apiBaseUrl}/UpdateCategory/${categoryData.categoryId}`, categoryData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "category/deleteCategory",
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`${apiBaseUrl}/DeleteCategory/${categoryId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

const initialState = {
    categoryItems: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
}

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCategory.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllCategory.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.categoryItems = action.payload;
            })
            .addCase(fetchAllCategory.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(addCategory.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.categoryItems.push(action.payload);
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(updateCategory.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.status = "succeeded";
                const index = state.categoryItems.findIndex(category => category.categoryId === action.payload.categoryId);
                if (index !== -1) {
                    state.categoryItems[index] = action.payload;
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(deleteCategory.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.categoryItems = state.categoryItems.filter(category => category.categoryId !== action.payload.categoryId);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default categorySlice.reducer;