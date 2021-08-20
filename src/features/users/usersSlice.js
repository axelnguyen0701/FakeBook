import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../api/server";

const initialState = [];

let axios_config = {
  headers: {
    authorization: "Bearer " + window.localStorage.getItem("access_tokens"),
  },
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await client.get("/users");
  return response.data;
});

export const sendRequest = createAsyncThunk(
  "users/sendFriendRequest",
  async (user) => {
    const response = await client.post(
      `/users/${user.id}/friend_requests`,
      {},
      axios_config
    );

    return response.data;
  }
);

export const acceptRequest = createAsyncThunk(
  "users/acceptRequest",
  async (data) => {
    const user = data.loggedInUser;
    const userSentRequest = data.user;
    console.log(user, userSentRequest);
    const response = await client.post(
      `/users/${user.id}/friend_requests/${userSentRequest.id}`,
      {},
      axios_config
    );
    return response.data;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchUsers.fulfilled]: (state, action) => {
      return action.payload;
    },
    [sendRequest.fulfilled]: (state, action) => {
      const { id, pendingRequest } = action.payload;
      const existingUser = state.find((user) => user.id === id);

      if (existingUser) {
        existingUser.pendingRequest = pendingRequest;
      }
    },
    [acceptRequest.fulfilled]: (state, action) => {
      const { userSentRequest } = action.payload;
      const { id, pendingRequest, friends } = userSentRequest;
      const existingUser = state.find((user) => user.id === id);

      if (existingUser) {
        existingUser.pendingRequest = pendingRequest;
        existingUser.friends = friends;
      }
    },
  },
});
export default usersSlice.reducer;

export const selectAllUsers = (state) => state.users;

export const selectUserById = (state, userId) =>
  state.users.find((user) => user.id === userId);
