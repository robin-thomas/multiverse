import React from 'react';

import { Row, Col } from 'react-bootstrap';

import AppHeader from './AppHeader';

import styles from './Content.module.css';

const Content = ({ children }) => (
  <>
    <AppHeader />
    <Row style={{ height: '100vh' }} noGutters={true}>
      <Col>
        <div className={styles['app-body']}>{children}</div>
      </Col>
    </Row>
  </>
);

export default Content;
