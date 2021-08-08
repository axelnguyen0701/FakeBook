import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../auth/authSlice";

//MATERIAL-UI
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Link as RouterLink } from "react-router-dom";
import MaterialLink from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export const NavBar = () => {
  const userAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const classes = useStyles();

  const renderLoginButton = () => {
    if (!userAuthenticated) {
      return (
        <Button color="inherit" component={RouterLink} to="/auth/login">
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

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>

          <Typography className={classes.title}>
            <MaterialLink component={RouterLink} to="/" color="inherit">
              Odin-book
            </MaterialLink>
          </Typography>

          {renderLoginButton()}
        </Toolbar>
      </AppBar>
    </div>
  );
};
