import React from 'react';

import { MDBIcon } from 'mdbreact';
import { Container, Row, Col } from 'react-bootstrap';

import EmptyRow from '../../utils/EmptyRow';

import styles from './Page.module.css';

const Page = ({ text, loader, error }) => (
  <Container className={styles['container']}>
    <Row className={styles['row']}>
      <Col className="align-self-center">
        {loader && !error ? (
          <Row>
            <Col>
              <MDBIcon icon="spinner" pulse size="2x" />
            </Col>
          </Row>
        ) : null}
        <EmptyRow />
        <Row>
          <Col>{error ? error : text}</Col>
        </Row>
      </Col>
    </Row>
  </Container>
);

export default Page;
