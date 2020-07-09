import React from 'react';

import { Container, Row, Col } from 'react-bootstrap';

import Header from './Header';
import About from './About';
import Content from '../../app/Content';

const Profile = () => {
  return (
    <Content>
      <Header />
      <Container>
        <Row>
          <Col md="4">
            <About />
          </Col>
        </Row>
      </Container>
    </Content>
  );
};

export default Profile;
