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
  }, [ctx.profile]);

  return (
    <Row>
      <Col md="auto" className="pr-0 align-self-justify">
        @
      </Col>
      <Col className="pl-0 align-self-justify">{username}</Col>
    </Row>
  );
};

export default Name;
