import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../api/server";
const initialState = {
  posts: [],
  status: "idle",
  error: null,
};

let axios_config = {
  headers: {
    authorization: "Bearer " + window.localStorage.getItem("access_tokens"),
  },
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await client.get("/posts");
  return response.data;
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (content) => {
    const response = await client.post("/posts", { content }, axios_config);
    return response.data;
  }
);

export const editPost = createAsyncThunk(
  "posts/editPost",
  async ({ postId, content }) => {
    const response = await client.put(
      `/posts/${postId}`,
      { content },
      axios_config
    );
    return response.data;
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId) => {
    const response = await client.delete(`/posts/${postId}`, axios_config);
    return response.data;
  }
);

export const likePost = createAsyncThunk("posts/likePost", async (post) => {
  const response = await client.put(
    `/posts/${post.id}/likes`,
    {
      content: post.content,
    },
    axios_config
  );
  return response.data;
});

export const postComment = createAsyncThunk(
  "posts/postComments",
  async ({ postId, content }) => {
    const response = await client.post(
      `/posts/${postId}/comments`,
      { content },
      axios_config
    );
    return response.data;
  }
);

export const editComment = createAsyncThunk(
  "posts/editComment",
  async ({ commentId, content, postId }) => {
    const response = await client.put(
      `/posts/${postId}/comments/${commentId}`,
      { content },
      axios_config
    );
    return response.data;
  }
);

export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ commentId, postId }) => {
    const response = await client.delete(
      `posts/${postId}/comments/${commentId}`,
      axios_config
    );
    return response.data;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchPosts.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.posts = state.posts.concat(action.payload);
    },
    [fetchPosts.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
    [addNewPost.fulfilled]: (state, action) => {
      state.posts.push(action.payload);
    },
    [editPost.fulfilled]: (state, action) => {
      const { id, content } = action.payload;
      const existingPost = state.posts.find((post) => post.id === id);

      existingPost.content = content;
    },
    [deletePost.fulfilled]: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload.id);
    },
    [likePost.fulfilled]: (state, action) => {
      const { id, likes } = action.payload;
      const existingPost = state.posts.find((post) => post.id === id);

      existingPost.likes = likes;
    },
    [postComment.fulfilled]: (state, action) => {
      const { post: postId } = action.payload;
      const existingPost = state.posts.find((post) => post.id === postId);
      existingPost.comments.push(action.payload);
    },
    [deleteComment.fulfilled]: (state, action) => {
      const { post: postId, id: commentId } = action.payload;
      let existingPost = state.posts.find((post) => post.id === postId);
      existingPost.comments = existingPost.comments.filter(
        (comment) => comment.id !== commentId
      );
    },
    [editComment.fulfilled]: (state, action) => {
      const { post: postId, id: commentId, content } = action.payload;
      let exisintComment = state.posts
        .find((post) => post.id === postId)
        .comments.find((comment) => comment.id === commentId);
      exisintComment.content = content;
    },
  },
});

export default postsSlice.reducer;

export const selectAllPosts = (state) => state.posts.posts;
export const selectPostById = (state, postId) =>
  state.posts.posts.find((post) => post.id === postId);
export const selectCommentById = (state, postId, commentId) => {
  return state.posts.posts
    .find((post) => post.id === postId)
    .comments.find((comment) => comment.id === commentId);
};
