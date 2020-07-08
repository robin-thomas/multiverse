import React from 'react';

import { Container, Row, Col } from 'react-bootstrap';

import Header from './Header';
import About from './About';

import styles from './Profile.module.css';

const Profile = () => {
  return (
    <>
      <Header />
      <Container>
        <Row>
          <Col md="4">
            <About />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
