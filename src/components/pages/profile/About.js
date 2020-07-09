import React, { useState } from 'react';

import { MDBBtn, MDBIcon } from 'mdbreact';
import { Card, Button } from 'react-bootstrap';

import styles from './About.module.css';

const About = () => {
  const [overlay, setOverlay] = useState(false);

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
        <Card.Title>ABOUT</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <hr />
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
};

export default About;
