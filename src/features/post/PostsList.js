import React, { useEffect } from "react";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MaterialLink from "@material-ui/core/Link";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, selectAllPosts, deletePost } from "./postsSlice";
import { Link } from "react-router-dom";
import { selectAllUsers } from "../users/usersSlice";
import { TimeAgo } from "./TimeStamp";

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
const PostExcerpt = ({ post, users }) => {
  const postAuthor = users.find((user) => user.id === post.author);
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
    <Grid item xs={12}>
      <Card className="post-excerpt" key={post.id} variant="outlined">
        <CardContent>
          {/* //Author */}
          <MaterialLink component={Link} to={postAuthor.url}>
            <Typography>{postAuthor.username}</Typography>
          </MaterialLink>
          {/* Date */}
          <Typography style={{ textAlign: "end" }}>
            <TimeAgo timestamp={post.date} />
          </Typography>
          {/* Content */}
          <Typography
            className="post-content"
            dangerouslySetInnerHTML={createMarkUp(post.content)}
          ></Typography>
          {/* Like */}

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
          <Button>
            <Typography className={classes.inlineIcon}>
              <ThumbUpIcon
                fontSize="small"
                className={classes.icon}
                color="primary"
              />
              <span> {post.likes}</span>
            </Typography>
          </Button>
          {renderDeleteButton()}
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
