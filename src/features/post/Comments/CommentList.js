import React, { useState } from "react";
import { Avatar, ListItemSecondaryAction, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../../users/usersSlice";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import MaterialLink from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import { TimeAgo } from "../TimeStamp";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { deleteComment } from "../postsSlice";
export const CommentList = ({ comments }) => {
  const users = useSelector((state) => selectAllUsers(state));
  const history = useHistory();
  const dispatch = useDispatch();
  // Utilities
  function createMarkUp(content) {
    return { __html: content };
  }

  const userAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loggedInUser = useSelector((state) => state.auth.user);
  // Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderedComments = () => {
    const sortedComments = comments
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date));

    return sortedComments.map((comment) => {
      const renderMenu = () => {
        if (userAuthenticated && commentAuthor.id === loggedInUser.id) {
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
                <MenuItem onClick={handleClose}>
                  {renderDeleteButton()}
                </MenuItem>
              </Menu>
            </>
          );
        }
      };

      const renderDeleteButton = () => {
        if (userAuthenticated && commentAuthor.id === loggedInUser.id) {
          return (
            <Button
              fullWidth
              color="secondary"
              onClick={() => {
                dispatch(
                  deleteComment({
                    commentId: comment.id,
                    postId: comment.post,
                  })
                );
              }}
            >
              <DeleteIcon /> Delete
            </Button>
          );
        }
      };

      const renderEditButton = () => {
        if (userAuthenticated && commentAuthor.id === loggedInUser.id) {
          return (
            <Button
              fullWidth
              color="primary"
              aria-label="edit"
              onClick={() => {
                history.push(`/posts/${comment.post}${comment.url}/edit`);
              }}
            >
              <EditIcon /> Edit
            </Button>
          );
        }
      };
      const commentAuthor = users.find((user) => user.id === comment.author);

      return (
        <ListItem className="comment-content" key={comment.id} divider>
          <ListItemAvatar>
            <Avatar alt={commentAuthor.username} src={commentAuthor.photo} />
          </ListItemAvatar>

          <ListItemText
            primary={
              <MaterialLink component={RouterLink} to={commentAuthor.url}>
                {commentAuthor.username}
              </MaterialLink>
            }
            secondary={
              <>
                <TimeAgo timestamp={comment.date} />
                {" - "}
                <Typography
                  component="span"
                  variant="body2"
                  dangerouslySetInnerHTML={createMarkUp(comment.content)}
                />
              </>
            }
          />
          <ListItemSecondaryAction>{renderMenu()}</ListItemSecondaryAction>
        </ListItem>
      );
    });
  };
  return <List>{renderedComments()}</List>;
};
