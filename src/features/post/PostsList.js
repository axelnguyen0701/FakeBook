import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, selectAllPosts } from "./postsSlice";
import { selectAllUsers } from "../users/usersSlice";
import { PostExcerpt } from "./PostExcerpt";
import Grid from "@material-ui/core/Grid";

export const PostsList = () => {
  const dispatch = useDispatch();
  const postStatus = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);
  const posts = useSelector((state) => selectAllPosts(state));
  const loggedInUser = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const users = useSelector((state) => selectAllUsers(state));

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  let content;

  if (postStatus === "loading") {
    content = <div className="loader">Loading...</div>;
  } else if (postStatus === "succeeded") {
    if (!isLoggedIn) {
      content = <div>No friends</div>;
    } else {
      const orderedPosts = posts
        .filter(
          (post) =>
            post.author === loggedInUser.id ||
            loggedInUser.friends.indexOf(post.author) !== -1
        )
        .sort((a, b) => b.date.localeCompare(a.date));

      content = orderedPosts.map((post) => {
        return (
          <Grid item xs={12} key={post.id}>
            <PostExcerpt post={post} users={users} />
          </Grid>
        );
      });
    }
  } else if (postStatus === "failed") {
    content = <div>{error}</div>;
  }

  return (
    <Grid container justifyContent="center" spacing={3}>
      <Grid container item spacing={3} xs={6}>
        {content}
      </Grid>
    </Grid>
  );
};
