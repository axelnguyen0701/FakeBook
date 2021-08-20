import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "../../api/server";
const initialState = {
  user: {},
  isAuthenticated: false,
  error: null,
};

export const login = createAsyncThunk("auth/login", async (data) => {
  const response = await client.post("auth/facebook/token", data);
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state, action) {
      state.isAuthenticated = false;
    },
    requestAccepted(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
  },
});

export default authSlice.reducer;

export const { logout, requestAccepted } = authSlice.actions;
