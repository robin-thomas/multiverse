import React, { useState, useContext, useEffect } from 'react';

import { Row, Col } from 'react-bootstrap';

import { DataContext } from '../../../utils/DataProvider';

const Name = () => {
  const ctx = useContext(DataContext);

  const [name, setName] = useState(null);

  useEffect(() => {
    if (ctx.profile.username) {
      setName(ctx.profile.username);
    }
  }, [ctx.profile]);

  return (
    <Row>
      <Col md="auto" className="pr-0 align-self-justify">
        @
      </Col>
      <Col className="pl-0 align-self-justify">{name}</Col>
    </Row>
  );
};

export default Name;
