import React from 'react';
import { Link } from 'react-router-dom';

import { MDBBtn } from 'mdbreact';
import { Container, Row, Col } from 'react-bootstrap';

import styles from './Header.module.css';

const Header = ({ button }) => (
  <Container fluid={true} className={styles['home']}>
    <Row>
      <Col md="auto" className="ml-auto">
        <Link to="/login">
          <MDBBtn color={button} size="sm">
            Try it out
          </MDBBtn>
        </Link>
      </Col>
    </Row>
  </Container>
);

export default Header;
