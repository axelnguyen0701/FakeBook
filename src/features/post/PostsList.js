import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, selectAllPosts, deletePost, likePost } from "./postsSlice";
import { Link } from "react-router-dom";
import { selectAllUsers } from "../users/usersSlice";
import { TimeAgo } from "./TimeStamp";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MaterialLink from "@material-ui/core/Link";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import CardHeader from "@material-ui/core/CardHeader";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  inlineIcon: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  icon: {
    marginRight: theme.spacing(0.5),
  },
}));

export const PostExcerpt = ({ post, users, user }) => {
  let postAuthor = user;
  if (users) {
    postAuthor = users.find((u) => u.id === post.author);
  }

  const dispatch = useDispatch();
  const userAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loggedInUser = useSelector((state) => state.auth.user);
  const classes = useStyle();

  function createMarkUp(content) {
    return { __html: content };
  }

  const renderDeleteButton = () => {
    if (userAuthenticated && postAuthor.id === loggedInUser.id) {
      return (
        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            dispatch(deletePost(post.id));
          }}
        >
          Delete
        </Button>
      );
    }
  };
  return (
    <Card className="post-excerpt" key={post.id} variant="outlined">
      <CardHeader
        avatar={<Avatar alt={postAuthor.username} src={postAuthor.photo} />}
        action={
          <IconButton aria-label="edit">
            <MaterialLink component={Link} to={post.url + "/edit"}>
              <EditIcon />
            </MaterialLink>
          </IconButton>
        }
        title={
          <MaterialLink component={Link} to={postAuthor.url}>
            {postAuthor.username}
          </MaterialLink>
        }
        subheader={<TimeAgo timestamp={post.date} />}
      />

      <CardContent>
        {/* Date */}
        <Typography style={{ textAlign: "end" }}></Typography>
        {/* Content */}
        <Typography
          className="post-content"
          dangerouslySetInnerHTML={createMarkUp(post.content)}
        />

        {/* Comments */}
        <ul className="comments">
          {post.comments.map((comment) => (
            <li className="comment-content" key={comment.id}>
              <Typography>
                {users.find((user) => user.id === comment.author).username}:
              </Typography>
              <div dangerouslySetInnerHTML={createMarkUp(comment.content)} />
            </li>
          ))}
        </ul>
      </CardContent>
      <CardActions>
        <Button onClick={() => dispatch(likePost(post))}>
          <Typography className={classes.inlineIcon}>
            {/* Like */}
            <ThumbUpIcon
              fontSize="small"
              className={classes.icon}
              color="primary"
            />
            <span> {post.likes.length}</span>
          </Typography>
        </Button>
        {renderDeleteButton()}
      </CardActions>
    </Card>
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
      return (
        <Grid item xs={12} key={post.id}>
          <PostExcerpt post={post} users={users} />
        </Grid>
      );
    });
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
