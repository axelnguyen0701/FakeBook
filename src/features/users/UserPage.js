import React from "react";
import { useSelector } from "react-redux";
import { selectUserById } from "../users/usersSlice";
import { selectAllPosts } from "../post/postsSlice";
import { PostExcerpt } from "../post/PostExcerpt";
import { AddPostForm } from "../post/AddPostForm";
//Material UI
import Grid from "@material-ui/core/Grid";
import { Container } from "@material-ui/core";
import UserCard from "./UserCard";

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
    <Container>
      <Grid
        container
        spacing={3}
        justifyContent="center"
        style={{ marginTop: "1rem" }}
      >
        <Grid
          container
          item
          xs={3}
          alignItems="flex-start"
          justifyContent="center"
        >
          <UserCard user={user} />
        </Grid>
        <Grid container item spacing={3} xs={6}>
          <Grid item xs={12}>
            <AddPostForm />
          </Grid>
          {renderedPosts}
        </Grid>
      </Grid>
    </Container>
  );
};
