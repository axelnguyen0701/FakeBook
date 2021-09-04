import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TimeAgo } from "./TimeStamp";
import { Link, useHistory } from "react-router-dom";
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
import { Collapse, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteIcon from "@material-ui/icons/Delete";
import { AddCommentForm } from "./Comments/AddCommentForm";
import { CommentList } from "./Comments/CommentList";

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
  const history = useHistory();
  const dispatch = useDispatch();
  // Props
  const userAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loggedInUser = useSelector((state) => state.auth.user);
  const classes = useStyle();
  let postAuthor = user;
  if (users) {
    postAuthor = users.find((u) => u.id === post.author);
  }
  // Utilities
  function createMarkUp(content) {
    return { __html: content };
  }
  // Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //   Comments
  const [showComments, setShowComments] = useState(false);

  const renderMenu = () => {
    if (userAuthenticated && postAuthor.id === loggedInUser.id) {
      return (
        <>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>{renderEditButton()}</MenuItem>
            <MenuItem onClick={handleClose}>{renderDeleteButton()}</MenuItem>
          </Menu>
        </>
      );
    }
  };

  const renderDeleteButton = () => {
    if (userAuthenticated && postAuthor.id === loggedInUser.id) {
      return (
        <Button
          fullWidth
          color="secondary"
          onClick={() => {
            dispatch(deletePost(post.id));
          }}
        >
          <DeleteIcon /> Delete
        </Button>
      );
    }
  };

  const renderEditButton = () => {
    if (userAuthenticated && postAuthor.id === loggedInUser.id) {
      return (
        <Button
          fullWidth
          color="primary"
          aria-label="edit"
          onClick={() => {
            history.push(post.url + "/edit");
          }}
        >
          <EditIcon /> Edit
        </Button>
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

  const renderComments = () => {
    return (
      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <CardContent>
          <CommentList comments={post.comments} />
          <AddCommentForm postId={post.id} />
        </CardContent>
      </Collapse>
    );
  };

  return (
    <Card className="post-excerpt" key={post.id} variant="outlined">
      <CardHeader
        avatar={<Avatar alt={postAuthor.username} src={postAuthor.photo} />}
        // Edit post
        action={renderMenu()}
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
      </CardContent>
      <CardActions>
        {renderLikeButton()}
        <Button
          color="primary"
          variant="contained"
          onClick={() => setShowComments(!showComments)}
        >
          Comments
        </Button>
      </CardActions>
      {renderComments()}
    </Card>
  );
};
