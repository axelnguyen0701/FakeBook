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
import { NavBar } from "./NavBar";
import { AuthPage } from "./features/auth/authPage";
import { Form } from "./features/post/EditForm";
import { FriendRequestList } from "./features/users/FriendRequestList";
import { FriendList } from "./features/users/FriendList";
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
          <Route exact path="/posts/:postId/edit" component={Form} />
          <Route exact path="/users" component={UsersList} />
          <Route exact path="/users/:userId" component={UserPage} />
          <Route exact path="/users/:userId/friends" component={FriendList} />
          <Route
            exact
            path="/users/:userId/friend_requests"
            component={FriendRequestList}
          />
          <Redirect to="/" />
        </Switch>
      </Container>
    </Router>
  );
};

export default App;
