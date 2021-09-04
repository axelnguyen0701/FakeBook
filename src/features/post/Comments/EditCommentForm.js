import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
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
import { editComment, selectCommentById } from "../postsSlice";
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

export const EditCommentForm = ({ match }) => {
  const { postId, commentId } = match.params;
  const comment = useSelector((state) =>
    selectCommentById(state, postId, commentId)
  );
  const classes = useStyles();
  const history = useHistory();
  const [content, setContent] = useState(decodeHTMLEntities(comment.content));
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const dispatch = useDispatch();

  const onContentChanged = (e) => setContent(e.target.value);

  const canSave = [content].every(Boolean) && addRequestStatus === "idle";

  const onSaveCommentClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        const resultAction = await dispatch(
          editComment({ commentId, content, postId })
        );
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
          <Typography variant="h5"> Edit Comment</Typography>
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
                onClick={onSaveCommentClicked}
                disabled={!canSave}
                color="primary"
                variant="contained"
              >
                Edit
              </Button>
            </Box>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};
