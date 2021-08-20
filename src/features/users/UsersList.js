import React from "react";
import { useSelector } from "react-redux";
import { selectAllUsers } from "./usersSlice";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core";
import UserCard from "./UserCard";

const useStyle = makeStyles((theme) => ({
  root: { marginTop: theme.spacing(2) },
}));
export const UsersList = () => {
  const classes = useStyle();
  const users = useSelector(selectAllUsers);
  const renderedUsers = users.map((user) => (
    <Grid item key={user.id} xs={4}>
      <UserCard user={user} />
    </Grid>
  ));
  return (
    <Grid container spacing={3} className={classes.root}>
      {renderedUsers}
    </Grid>
  );
};
