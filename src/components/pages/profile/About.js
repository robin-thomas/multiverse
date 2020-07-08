import React from 'react';

import { Card, Button } from 'react-bootstrap';

import styles from './About.module.css';

const About = () => {
  return (
    <Card className={styles['about-card']}>
      <Card.Img
        variant="top"
        className={styles['about-pic']}
        src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg"
      />
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
