import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/post/postsSlice";
import usersReducer from "../features/users/usersSlice";
import authReducer from "../features/auth/authSlice";
export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    auth: authReducer,
  },
});
