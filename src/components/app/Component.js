import React from 'react';

import Home from '../pages/home';
import Login from '../pages/login';
import Profile from '../pages/profile';

const getComponent = (page) => {
  switch (page) {
    case 'profile':
      return <Profile />;

    case 'login':
      return <Login />;

    case 'home':
    default:
      return <Home />;
  }
};

export default getComponent;
