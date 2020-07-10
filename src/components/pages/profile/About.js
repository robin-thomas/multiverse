import React, { useState, useContext, useEffect } from 'react';

import { MDBBtn, MDBIcon } from 'mdbreact';
import { Card, Button } from 'react-bootstrap';

import Box from '../../../utils/3box';
import TextInput from '../../utils/TextInput';
import { DataContext } from '../../utils/DataProvider';

import styles from './About.module.css';

const About = ({ profile }) => {
  const ctx = useContext(DataContext);

  const [about, setAbout] = useState(null);

  const [overlay, setOverlay] = useState(false);

  useEffect(() => {
    console.log(profile);
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
        className={styles[`about-pic${overlay ? '-overlay-trigger' : ''}`]}
        src="https://marketplace.canva.com/is4RU/MAB_5dis4RU/2/tl/canva-businesswoman-avatar-with-business-icon-MAB_5dis4RU.png"
        onMouseEnter={() => setOverlay(true)}
      />
      {overlay ? (
        <Card.ImgOverlay onMouseLeave={() => setOverlay(false)}>
          <MDBBtn
            outline
            color="primary"
            title="Edit your picture"
            className={styles['about-edit-pic-icon']}
          >
            <MDBIcon icon="edit" />
          </MDBBtn>
        </Card.ImgOverlay>
      ) : null}
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
