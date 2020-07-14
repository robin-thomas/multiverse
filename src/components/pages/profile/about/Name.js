import React, { useState, useContext, useEffect } from 'react';

import { Row, Col } from 'react-bootstrap';

import Box from '../../../../utils/3box/index.js';
import TextInput from '../../../utils/TextInput';
import { DataContext } from '../../../utils/DataProvider';

import styles from './Name.module.css';

const Name = () => {
  const ctx = useContext(DataContext);

  const [name, setName] = useState(null);

  useEffect(() => {
    if (ctx.profile.username) {
      setName(ctx.profile.name);
    }
  }, [ctx.profile]);

  const onChange = (name) => {
    if (/^[a-z0-9]+$/.test(name)) {
      setName(name);
    }
  };

  const updateName = () => {
    Box.set(
      Box.DATASTORE_KEY_PROFILE_PUBLIC,
      { username: name },
      Box.state.PUBLIC
    );
  };

  return (
    <Row className={styles['name']}>
      <Col md="auto" className="pr-0 align-self-justify">
        @
      </Col>
      <Col className="pl-0 align-self-justify">
        <TextInput
          value={name}
          hint="<username>"
          onChange={onChange}
          updateText={updateName}
        />
      </Col>
    </Row>
  );
};

export default Name;
