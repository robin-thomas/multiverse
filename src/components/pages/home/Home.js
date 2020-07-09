import React from 'react';
import { Link } from 'react-router-dom';

import { MDBBtn } from 'mdbreact';
import { Container, Row, Col } from 'react-bootstrap';

import Content from '../../app/Content';

import styles from './Home.module.css';

const Home = () => (
  <Content>
    <Container fluid={true} className={styles['home']}>
      <Row>
        <Col md="auto" className="ml-auto">
          <Link to="/login">
            <MDBBtn color="primary">Get In</MDBBtn>
          </Link>
        </Col>
      </Row>
    </Container>
  </Content>
);

export default Home;
