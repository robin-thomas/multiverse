import React from 'react';

import { Container, Row, Col } from 'react-bootstrap';

import Name from './Name';
import ShareButton from './ShareButton';
import EmptyRow from '../../../utils/EmptyRow';

import styles from './Header.module.css';

const Header = ({ url, profile }) => (
  <Container className={styles['container']} fluid={true}>
    <div className={styles['container-overlay']} />
    <Container className={styles['container-child']}>
      <Row>
        <Col>&nbsp;</Col>
      </Row>
      <EmptyRow rows={2} />
      <Row>
        <Col md={{ span: 5, offset: 4 }}>
          <Row>
            <Col>
              <Name profile={profile} />
            </Col>
          </Row>
        </Col>
        <Col md="3">
          <ShareButton url={url} />
        </Col>
      </Row>
    </Container>
  </Container>
);

export default Header;
