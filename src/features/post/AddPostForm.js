import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { makeStyles } from "@material-ui/core/styles";
import { addNewPost } from "./postsSlice";
import {
  Button,
  TextField,
  Grid,
  Container,
  Typography,
  Box,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "2rem 0rem",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginBottom: theme.spacing(2),
  },
  submit: {
    marginTop: theme.spacing(1),
    float: "right",
  },
}));

export const AddPostForm = () => {
  const classes = useStyles();
  const [content, setContent] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const dispatch = useDispatch();

  const onContentChanged = (e) => setContent(e.target.value);

  const canSave = [content].every(Boolean) && addRequestStatus === "idle";

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        const resultAction = await dispatch(addNewPost(content));
        unwrapResult(resultAction);
        setContent("");
      } catch (err) {
        console.error("Failed to save the post: ", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  return (
    <Container component="main">
      <Grid
        container
        alignItems="center"
        direction="column"
        className={classes.root}
      >
        <Grid container item xs={6}>
          <Typography variant="h5">Add a New Post</Typography>
          <form
            className={classes.form}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <TextField
              multiline
              minRows="3"
              id="content"
              name="content"
              value={content}
              onChange={onContentChanged}
              fullWidth
              label="What's on your mind?"
            />

            <Box className={classes.submit}>
              <Button
                onClick={onSavePostClicked}
                disabled={!canSave}
                color="primary"
                variant="contained"
              >
                Post
              </Button>
            </Box>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};
