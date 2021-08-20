import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { requestAccepted } from "../auth/authSlice";
import { acceptRequest, sendRequest } from "./usersSlice";
import { useHistory } from "react-router";

import {
  Card,
  Box,
  Avatar,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
const useStyle = makeStyles((theme) => ({
  card: { width: "100%", textAlign: "center" },
  cardHeader: { padding: theme.spacing(2) },
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
}));

const UserCard = ({ user }) => {
  const history = useHistory();
  const onCardClick = () => history.push(user.url);
  const classes = useStyle();
  const loggedInUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const onAddFriend = async () => {
    try {
      const originalPromiseResult = await dispatch(sendRequest(user)).unwrap();
      console.log(originalPromiseResult);
    } catch (error) {
      console.log(error);
    }
  };

  const onAcceptRequest = async () => {
    try {
      const { user: updatedUser } = await dispatch(
        acceptRequest({ user, loggedInUser })
      ).unwrap();
      dispatch(requestAccepted(updatedUser));
    } catch (error) {
      console.log(error);
    }
  };

  const renderAddFriendButton = () => {
    if (!isAuthenticated) {
      return <Typography>Please login to add friend</Typography>;
    }

    //User is current loggedin user
    if (user.id === loggedInUser.id) {
      return null;
    }

    //Already friends
    if (user.friends.indexOf(loggedInUser.id) !== -1) {
      return <Typography>You guys are friends</Typography>;
    }

    //If user already received request
    if (loggedInUser.pendingRequest.indexOf(user.id) !== -1) {
      return (
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => onAcceptRequest()}
        >
          Accept friend request
        </Button>
      );
    }

    //If friend-request sent
    if (user.pendingRequest.indexOf(loggedInUser.id) !== -1) {
      return (
        <Button fullWidth variant="contained" color="primary" disabled>
          Request already sent
        </Button>
      );
    }

    //If not friends
    if (user.friends.indexOf(loggedInUser.id) === -1) {
      return (
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => onAddFriend()}
        >
          Add friend
        </Button>
      );
    }
  };

  return (
    <Card className={classes.card} onClick={onCardClick}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={classes.cardHeader}
      >
        <Avatar
          alt={user.username}
          src={user.photo}
          className={classes.large}
        />
      </Box>
      <CardContent>
        <Typography>{user.username}</Typography>
      </CardContent>
      <CardActions>{renderAddFriendButton()}</CardActions>
    </Card>
  );
};

export default UserCard;
