import React from 'react';

import Home from '../pages/home';
import Login from '../pages/login';

const getComponent = (page) => {
  switch (page) {
    case 'login':
      return <Login />;

    case 'home':
    default:
      return <Home />;
  }
};

export default getComponent;
