import React from 'react';
import { useParams } from 'react-router-dom';

import { Container, Row, Col } from 'react-bootstrap';

import Header from './header';
import About from './About';
import Content from '../../app/Content';

const Profile = () => {
  const { address } = useParams();
  console.log(address);

  return (
    <Content>
      <Header url="http://google.com" />
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
