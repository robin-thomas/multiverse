import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from '../pages/home';
import Login from '../pages/login';
import Profile from '../pages/profile';

const App = () => (
  <Switch>
    <Route path="/login">
      <Login />
    </Route>

    <Route path="/profile/:address">
      <Profile />
    </Route>

    <Route path="/">
      <Home />
    </Route>
  </Switch>
);

export default App;
