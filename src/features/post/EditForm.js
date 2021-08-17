import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { editPost, selectPostById } from "./postsSlice";
import { useHistory } from "react-router";
import {
  Button,
  TextField,
  Grid,
  Container,
  Typography,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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

function decodeHTMLEntities(text) {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
}

export const Form = ({ match }) => {
  const { postId } = match.params;
  const post = useSelector((state) => selectPostById(state, postId));
  const classes = useStyles();
  const history = useHistory();
  const [content, setContent] = useState(decodeHTMLEntities(post.content));
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const dispatch = useDispatch();

  const onContentChanged = (e) => setContent(e.target.value);

  const canSave = [content].every(Boolean) && addRequestStatus === "idle";

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        const resultAction = await dispatch(editPost({ postId, content }));
        unwrapResult(resultAction);
        setContent("");
        history.push("/");
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
          <Typography variant="h5"> Edit Post</Typography>
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
              defaultValue={content}
              onChange={onContentChanged}
              fullWidth
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
