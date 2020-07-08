import React from 'react';

import { MDBBtn, MDBIcon } from 'mdbreact';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

import EmptyRow from '../../utils/EmptyRow';

import styles from './Header.module.css';

const Header = () => {
  return (
    <Container className={styles['container']} fluid={true}>
      <Container className={styles['container-child']}>
        <Row>
          <Col>&nbsp;</Col>
        </Row>
        <EmptyRow rows={2} />
        <Row>
          <Col md={{ span: 5, offset: 4 }}>
            <Row>
              <Col>Robin Thomas</Col>
            </Row>
            <Row className={styles['last-row-country']}>
              <Col>Singapore, Singapore</Col>
            </Row>
          </Col>
          <Col md="3">
            <MDBBtn
              outline
              color="primary"
              className={styles['last-row-share-profile']}
            >
              <MDBIcon icon="share-square" />
              &nbsp;Share profile
            </MDBBtn>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Header;
