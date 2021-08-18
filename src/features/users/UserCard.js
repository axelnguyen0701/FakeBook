import { Card, Box, Avatar, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyle = makeStyles((theme) => ({
  card: { width: "100%", textAlign: "center" },
  cardHeader: { padding: theme.spacing(2) },
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
}));

const UserCard = ({ user }) => {
  const classes = useStyle();
  return (
    <Card className={classes.card}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={classes.cardHeader}
      >
        <Avatar
          alt={user.username}
          src={user.photo}
          variant="r"
          className={classes.large}
        />
      </Box>
      <CardContent>
        <Typography>{user.username}</Typography>
      </CardContent>
    </Card>
  );
};

export default UserCard;
