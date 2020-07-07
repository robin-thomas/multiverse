import React, { useState } from 'react';

import Space from './Space';
import Metamask from './Metamask';

const Login = () => {
  const [stage, setStage] = useState(0);

  switch (stage) {
    case 1:
      return <Space />;

    case 0:
    default:
      return <Metamask />;
  }
};

export default Login;
