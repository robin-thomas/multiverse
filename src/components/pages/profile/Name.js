import React, { useState, useContext, useEffect } from 'react';

import { Row, Col } from 'react-bootstrap';

import Box from '../../../utils/3box';
import TextInput from '../../utils/TextInput';
import { DataContext } from '../../utils/DataProvider';

import styles from './Name.module.css';

const Name = ({ profile }) => {
  const ctx = useContext(DataContext);

  const [name, setName] = useState(null);

  useEffect(() => {
    if (profile[Box.DATASTORE_KEY_USERNAME]) {
      setName(profile[Box.DATASTORE_KEY_USERNAME]);
    }
  }, [profile]);

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
      <Col md="auto" className="pr-0">
        @
      </Col>
      <Col className="pl-0">
        <TextInput
          value={name}
          hint="<username>"
          editable={profile.editable}
          onChange={onChange}
          updateText={updateName}
        />
      </Col>
    </Row>
  );
};

export default Name;
