import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../api/server";

const initialState = [];

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await client.get("/users");
  return response.data;
});
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchUsers.fulfilled]: (state, action) => {
      return action.payload;
    },
  },
});
export default usersSlice.reducer;

export const selectAllUsers = (state) => state.users;

export const selectUserById = (state, userId) =>
  state.users.find((user) => user.id === userId);
