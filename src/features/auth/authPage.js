import React from "react";
import FacebookLogin from "react-facebook-login";
import { login, logout } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

//Material UI
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
}));

export const AuthPage = () => {
  const history = useHistory();
  const classes = useStyle();
  const dispatch = useDispatch();
  const userAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const responseFacebook = async (res) => {
    try {
      const data = {
        access_token: res.accessToken,
      };
      const response = await dispatch(login(data));
      if (response.meta.requestStatus === "fulfilled") {
        window.localStorage.setItem("access_tokens", res.accessToken);
        history.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderAuthPage = () => {
    if (!userAuthenticated) {
      return (
        <FacebookLogin
          appId={process.env.REACT_APP_ID}
          autoLoad={true}
          callback={responseFacebook}
        />
      );
    }

    return (
      <>
        <Typography>User already logged in</Typography>
        <Button
          onClick={() => dispatch(logout())}
          color="secondary"
          variant="contained"
        >
          Log out
        </Button>
      </>
    );
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
      className={classes.container}
    >
      {renderAuthPage()}
    </Grid>
  );
};
