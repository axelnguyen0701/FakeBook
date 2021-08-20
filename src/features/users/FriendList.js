import React from "react";
import { selectAllUsers, selectUserById } from "./usersSlice";
import { useSelector } from "react-redux";

//UI
import UserCard from "./UserCard";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core";
const useStyle = makeStyles((theme) => ({
  root: { marginTop: theme.spacing(2) },
}));

export const FriendList = ({ match }) => {
  const { userId } = match.params;
  const user = useSelector((state) => selectUserById(state, userId));
  const userList = useSelector((state) => selectAllUsers(state));

  const classes = useStyle();

  const renderedFriends = () => {
    return user.friends.map((request) => {
      const userSentRequest = userList.find((e) => e.id === request);
      return (
        <Grid
          item
          key={request}
          style={{ width: "50%", listStyle: "none" }}
          xs="3"
        >
          <UserCard user={userSentRequest} />
        </Grid>
      );
    });
  };

  return (
    <>
      <Grid container spacing={3} className={classes.root}>
        {renderedFriends()}
      </Grid>
    </>
  );
};
