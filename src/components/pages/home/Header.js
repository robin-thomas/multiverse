import React from 'react';
import { Link } from 'react-router-dom';

import { MDBBtn } from 'mdbreact';
import { Container, Row, Col } from 'react-bootstrap';

import styles from './Header.module.css';

import { app } from '../../../../config.json';

const Header = ({ button }) => (
  <Container fluid={true} className={styles['home']}>
    <Row>
      <Col md={{ scale: 1, offset: 1 }} className={styles['home-logo']}>
        {app.name}
      </Col>
      <Col md="auto" className="ml-auto align-self-center">
        <Link to="/login">
          <MDBBtn color={button} size="sm">
            Try it out
          </MDBBtn>
        </Link>
      </Col>
    </Row>
  </Container>
);

const PageHeader = ({ button }) => (
  <Container fluid={true} className={styles['home-page']}>
    <Row>
      <Col md={{ scale: 1, offset: 1 }} className={styles['home-logo']}>
        {app.name}
      </Col>
    </Row>
  </Container>
);

export { PageHeader };
export default Header;
