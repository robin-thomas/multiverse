import React from 'react';

import { MDBIcon } from 'mdbreact';
import { Container, Row, Col } from 'react-bootstrap';

import EmptyRow from '../../utils/EmptyRow';

import styles from './Page.module.css';

const Page = ({ text, loader, error, errorNext }) => (
  <Container fluid={true} className={styles['container']}>
    <Row className={styles['row']}>
      <Col md="5" className="align-self-center mx-auto">
        {loader && !error ? (
          <Row>
            <Col>
              <MDBIcon icon="spinner" pulse size="2x" />
            </Col>
          </Row>
        ) : null}
        <Row>
          <Col>{error ? error : text}</Col>
        </Row>
        <EmptyRow />
        {errorNext ? errorNext : null}
      </Col>
    </Row>
  </Container>
);

export default Page;
