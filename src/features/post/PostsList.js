import React, { useEffect } from "react";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MaterialLink from "@material-ui/core/Link";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, selectAllPosts, deletePost } from "./postsSlice";
import { Link } from "react-router-dom";
import { selectAllUsers } from "../users/usersSlice";

const PostExcerpt = ({ post, users }) => {
  const dispatch = useDispatch();
  const postAuthor = users.find((user) => user.id === post.author);
  return (
    <Grid item xs={12}>
      <Card className="post-excerpt" key={post.id} variant="outlined">
        <CardContent>
          <MaterialLink component={Link} to={postAuthor.url}>
            <Typography>{postAuthor.username}</Typography>
          </MaterialLink>

          <Typography className="post-content">
            {post.content.substring(0, 100)}
          </Typography>
          <Typography className="likes">Likes: {post.likes}</Typography>
          <ul className="comments">
            {post.comments.map((comment) => (
              <li className="comment-content" key={comment.id}>
                <Typography>
                  {users.find((user) => user.id === comment.author).username}:
                </Typography>
                {comment.content}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardActions>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              dispatch(deletePost(post.id));
            }}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export const PostsList = () => {
  const dispatch = useDispatch();
  const postStatus = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);
  const posts = useSelector((state) => selectAllPosts(state));
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
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));

    content = orderedPosts.map((post) => {
      return <PostExcerpt post={post} key={post.id} users={users} />;
    });
  } else if (postStatus === "failed") {
    content = <div>{error}</div>;
  }

  return (
    <Grid container alignItems="stretch" spacing={3}>
      {content}
    </Grid>
  );
};
