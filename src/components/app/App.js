import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from '../pages/home';
import Login from '../pages/login';
import Profile from '../pages/profile';
import NewPost from '../pages/new/post';

const App = () => (
  <Switch>
    <Route path="/login">
      <Login />
    </Route>

    <Route path="/profile/:address">
      <Profile />
    </Route>

    <Route path="/new/post">
      <NewPost />
    </Route>

    <Route path="/">
      <Home />
    </Route>
  </Switch>
);

export default App;
