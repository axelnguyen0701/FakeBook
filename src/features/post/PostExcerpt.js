import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { TimeAgo } from "./TimeStamp";
import { Link } from "react-router-dom";
import { deletePost, likePost } from "./postsSlice";
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

  const renderEditButton = () => {
    if (userAuthenticated && postAuthor.id === loggedInUser.id) {
      return (
        <IconButton aria-label="edit">
          <MaterialLink component={Link} to={post.url + "/edit"}>
            <EditIcon />
          </MaterialLink>
        </IconButton>
      );
    }
  };

  const renderLikeButton = () => {
    if (userAuthenticated) {
      return (
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
      );
    }
  };
  return (
    <Card className="post-excerpt" key={post.id} variant="outlined">
      <CardHeader
        avatar={<Avatar alt={postAuthor.username} src={postAuthor.photo} />}
        // Edit post
        action={renderEditButton()}
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
        {renderLikeButton()}

        {renderDeleteButton()}
      </CardActions>
    </Card>
  );
};
