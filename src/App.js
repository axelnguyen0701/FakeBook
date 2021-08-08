import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Container from "@material-ui/core/Container";
import { AddPostForm } from "./features/post/AddPostForm";

import { PostsList } from "./features/post/PostsList";
import { SinglePostPage } from "./features/post/SinglePostPage";
import { UserPage } from "./features/users/UserPage";
import { UsersList } from "./features/users/UsersList";
import { NavBar } from "./features/post/NavBar";
import { AuthPage } from "./features/auth/authPage";
const App = () => {
  return (
    <Router>
      <NavBar />
      <Container className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <>
                <AddPostForm />
                <PostsList />
              </>
            )}
          />
          <Route exact path="/auth/login" component={AuthPage} />
          <Route exact path="/posts/:postId" component={SinglePostPage} />
          <Route exact path="/users" component={UsersList} />
          <Route exact path="/users/:userId" component={UserPage} />

          <Redirect to="/" />
        </Switch>
      </Container>
    </Router>
  );
};

export default App;
