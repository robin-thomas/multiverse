import React from 'react';

import Home from '../pages/home';

const getComponent = (page) => {
  switch (page) {
    case 'home':
    default:
      return <Home />;
  }
};

export default getComponent;
