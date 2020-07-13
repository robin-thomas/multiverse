import React from 'react';
import { Link } from 'react-router-dom';

import { Container, Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';

import styles from './Header.module.css';

import { app } from '../../../../config.json';

const Header = ({ button }) => (
  <Container fluid={true} className={styles['home']}>
    <Row>
      <Col md={{ span: 2, offset: 1 }} className={styles['home-logo']}>
        {app.name}
      </Col>
      <Col md="auto" className="ml-auto align-self-center">
        <Link to="/login">
          <Button variant="contained" color={button}>
            Try it out
          </Button>
        </Link>
      </Col>
    </Row>
  </Container>
);

const PageHeader = ({ button }) => (
  <Container fluid={true} className={styles['home-page']}>
    <Row>
      <Col md={{ span: 2, offset: 1 }} className={styles['home-logo']}>
        {app.name}
      </Col>
    </Row>
  </Container>
);

export { PageHeader };
export default Header;
