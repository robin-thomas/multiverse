import React, { useState, useContext, useEffect } from 'react';

import { Row, Col } from 'react-bootstrap';

import Box from '../../../../utils/3box';
import TextInput from '../../../utils/TextInput';
import { DataContext } from '../../../utils/DataProvider';

import styles from './Name.module.css';

const Name = () => {
  const ctx = useContext(DataContext);

  const [name, setName] = useState(null);

  useEffect(() => {
    if (ctx.profile[Box.DATASTORE_KEY_USERNAME]) {
      setName(ctx.profile[Box.DATASTORE_KEY_USERNAME]);
    }
  }, [ctx.profile]);

  const onChange = (name) => {
    if (/^[a-z0-9]+$/.test(name)) {
      setName(name);
    }
  };

  const updateName = async () => {
    await Box.set(Box.DATASTORE_KEY_USERNAME, name, {
      address: ctx.address,
      state: Box.DATASTORE_STATE_PUBLIC,
    });
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
