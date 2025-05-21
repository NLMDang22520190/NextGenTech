import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../AxiosInstance/AxiosInstance";

const apiBaseUrl = "/api/Account";

export const fetchAllUser = createAsyncThunk(
    "user/fetchAllUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`${apiBaseUrl}/AdminGetAllUsers`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const addUser = createAsyncThunk(
    "user/addUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post(`${apiBaseUrl}/AddUser`, userData);
            return response.data;
        } catch (error) {
            // For debugging only (not visible to users)
            console.error("Error in addUser thunk:", error);

            // Use a simple user-friendly message
            let errorMessage = "Unable to add user";

            // Check specifically for email duplication error
            if (error.response &&
                error.response.data &&
                error.response.data.message &&
                error.response.data.message.includes("Email đã tồn tại")) {
                errorMessage = "Email already exists";
            }

            return rejectWithValue(errorMessage);
        }
    }
);

export const updateUser = createAsyncThunk(
    "user/updateUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.put(`${apiBaseUrl}/UpdateUser/${userData.userId}`, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const deleteUser = createAsyncThunk(
    "user/deleteUser",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`${apiBaseUrl}/DeleteUser/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

const initialState = {
    userItems: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.userItems = action.payload;
            })
            .addCase(fetchAllUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(addUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.userItems.push(action.payload);
            })
            .addCase(addUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(updateUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                const index = state.userItems.findIndex(user => user.userId === action.payload.userId);
                if (index !== -1) {
                    state.userItems[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(deleteUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.userItems = state.userItems.filter(user => user.userId !== action.payload.userId);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default userSlice.reducer;