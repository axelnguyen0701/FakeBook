import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./features/auth/authSlice";

//MATERIAL-UI
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import FacebookIcon from "@material-ui/icons/Facebook";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    cursor: "pointer",
    flexGrow: 1,
  },
}));

export const NavBar = () => {
  const history = useHistory();
  const userAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const classes = useStyles();

  const renderLoginButton = () => {
    if (!userAuthenticated) {
      return (
        <Button color="inherit" onClick={() => history.push("/auth/login")}>
          Login
        </Button>
      );
    }
    return (
      <>
        <Button color="inherit" onClick={() => dispatch(logout())}>
          Log out
        </Button>
      </>
    );
  };

  const renderFriendsAndRequests = () => {
    if (userAuthenticated) {
      return (
        <>
          <Button
            onClick={() => history.push(`/users/${user.id}/friend_requests`)}
            color="inherit"
          >
            Requests
          </Button>
          <Button onClick={() => history.push(`/users`)} color="inherit">
            Users
          </Button>
          <Button
            onClick={() => history.push(`/users/${user.id}/friends`)}
            color="inherit"
          >
            Friends
          </Button>
        </>
      );
    }
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit">
            <FacebookIcon fontSize="large" />
          </IconButton>

          <Typography
            className={classes.title}
            onClick={() => history.push("/")}
          >
            Fakebook
          </Typography>
          <Button
            onClick={() => history.push(`/users/${user.id}`)}
            color="inherit"
          >
            {userAuthenticated ? `Hi, ${user.username}` : null}
          </Button>
          {renderFriendsAndRequests()}
          {renderLoginButton()}
        </Toolbar>
      </AppBar>
    </div>
  );
};
