import axios from "axios";

export default axios.create({
  baseURL: process.env.REACT_APP_SERVER,
  headers: {
    authorization: "bearer " + localStorage.getItem("user_token"),
  },
});
