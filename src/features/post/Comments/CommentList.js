import React from "react";
import { Avatar, Divider, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../../users/usersSlice";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import MaterialLink from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import { TimeAgo } from "../TimeStamp";
export const CommentList = ({ comments }) => {
  const users = useSelector((state) => selectAllUsers(state));
  const renderedComments = () => {
    // Utilities
    function createMarkUp(content) {
      return { __html: content };
    }
    const sortedComments = comments
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));

    return sortedComments.map((comment) => {
      const commentAuthor = users.find((user) => user.id === comment.author);
      return (
        <>
          <Divider variant="inset" component="li" />
          <ListItem className="comment-content" key={comment.id}>
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
                  <Typography
                    dangerouslySetInnerHTML={createMarkUp(comment.content)}
                  />
                </>
              }
            />
          </ListItem>
        </>
      );
    });
  };
  return <List>{renderedComments()}</List>;
};
