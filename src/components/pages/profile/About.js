import React, { useState, useContext, useEffect } from 'react';

import { MDBBtn, MDBIcon } from 'mdbreact';
import { Card, Button } from 'react-bootstrap';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';

import Box from '../../../utils/3box';
import TextInput from '../../utils/TextInput';
import { DataContext } from '../../utils/DataProvider';

import styles from './About.module.css';

const About = ({ profile }) => {
  const ctx = useContext(DataContext);

  const [about, setAbout] = useState(null);

  useEffect(() => {
    if (profile[Box.DATASTORE_KEY_ABOUT]) {
      setAbout(profile[Box.DATASTORE_KEY_ABOUT]);
    }
  }, [profile]);

  const updateAbout = async () => {
    await Box.set(Box.DATASTORE_KEY_ABOUT, about, {
      address: ctx.address,
      state: Box.DATASTORE_STATE_PUBLIC,
    });
  };

  return (
    <Card className={styles['about-card']}>
      <Card.Img
        variant="top"
        className={styles[`about-pic-overlay-trigger`]}
        src="https://image.freepik.com/free-photo/river-foggy-mountains-landscape_1204-511.jpg"
      />
      <Card.ImgOverlay>
        <IconButton aria-label="delete">
          <SettingsIcon fontSize="large" />
        </IconButton>
      </Card.ImgOverlay>
      <Card.Body>
        <Card.Title class={styles['about-title']}>About</Card.Title>
        <Card.Text>
          <TextInput
            type="textarea"
            value={about}
            hint="<Write that killer bio about yourself>"
            editable={profile.editable}
            onChange={setAbout}
            updateText={updateAbout}
          />
        </Card.Text>
        <hr />
        <Button variant="primary">Become Friends?</Button>
      </Card.Body>
    </Card>
  );
};

export default About;
