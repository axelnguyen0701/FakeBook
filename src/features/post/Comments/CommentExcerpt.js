import React from "react";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../../users/usersSlice";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemAvatar";
import MaterialLink from "@material-ui/core/Link";
import { TimeAgo } from "../TimeStamp";
import Typography from "@material-ui/core/Typography";
import { Link as RouterLink } from "react-router-dom";

export const CommentExcerpt = ({ comment }) => {
  const users = useSelector((state) => selectAllUsers(state));
  const commentAuthor = users.find((user) => user.id === comment.author);
  function createMarkUp(content) {
    return { __html: content };
  }
  return (
    <ListItem className="comment-content" divider>
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
  );
};
