import React from "react";
import { useSelector } from "react-redux";
import { selectUserById } from "../users/usersSlice";
import { selectAllPosts } from "../post/postsSlice";
import { PostExcerpt } from "../post/PostsList";

//Material UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

export const UserPage = ({ match }) => {
  const { userId } = match.params;
  const user = useSelector((state) => selectUserById(state, userId));
  const postsForUser = useSelector((state) => {
    const allPosts = selectAllPosts(state);
    return allPosts
      .filter((post) => post.author === userId)
      .sort((a, b) => b.date.localeCompare(a.date));
  });

  const renderedPosts = postsForUser.map((post) => (
    <Grid item key={post.id} xs={12}>
      <PostExcerpt post={post} user={user} />
    </Grid>
  ));

  return (
    <section>
      <Typography variant="h3" component="h2">
        {user.username}'s profile
      </Typography>
      <Grid
        container
        spacing={3}
        justifyContent="center"
        style={{ marginTop: "1rem" }}
      >
        <Grid container item spacing={3}>
          {renderedPosts}
        </Grid>
      </Grid>
    </section>
  );
};
