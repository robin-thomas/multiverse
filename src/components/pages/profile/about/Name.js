import React, { useState, useContext, useEffect } from 'react';

import { Row, Col } from 'react-bootstrap';

import { DataContext } from '../../../utils/DataProvider';

const Name = () => {
  const ctx = useContext(DataContext);

  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (ctx.profile.username) {
      setUsername(ctx.profile.username);
    }
  }, [ctx.profile.username]);

  return (
    <Row>
      <Col style={{ fontWeight: '500' }}>@{username}</Col>
    </Row>
  );
};

export default Name;
