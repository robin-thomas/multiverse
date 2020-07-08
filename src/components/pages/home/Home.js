import React, { useContext } from 'react';

import { MDBBtn } from 'mdbreact';
import { Container, Row, Col } from 'react-bootstrap';

import { DataContext } from '../../utils/DataProvider';

import styles from './Home.module.css';

const Home = () => {
  const ctx = useContext(DataContext);

  const onClick = () => {
    ctx.setPage('login');
  };

  return (
    <Container fluid={true} className={styles['home']}>
      <Row>
        <Col md="auto" className="ml-auto">
          <MDBBtn color="primary" onClick={onClick}>
            Get In
          </MDBBtn>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
