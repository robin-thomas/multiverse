import React, { useState } from 'react';

import Space from './Space';
import Metamask from './Metamask';

const Login = () => {
  const [stage, setStage] = useState(0);

  switch (stage) {
    case 1:
      return <Space setStage={setStage} />;

    case 0:
    default:
      return <Metamask setStage={setStage} />;
  }
};

export default Login;
