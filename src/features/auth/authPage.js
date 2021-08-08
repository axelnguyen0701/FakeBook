import React from "react";
import FacebookLogin from "react-facebook-login";
import { login, logout } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
export const AuthPage = () => {
  const dispatch = useDispatch();
  const userAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const responseFacebook = async (res) => {
    const data = {
      access_token: res.accessToken,
    };
    dispatch(login(data));
  };

  if (!userAuthenticated) {
    return (
      <FacebookLogin
        appId="139677108274481"
        autoLoad={true}
        callback={responseFacebook}
      />
    );
  }

  return (
    <>
      <div>User already logged in</div>
      <button onClick={() => dispatch(logout())}>Log out</button>
    </>
  );
};
