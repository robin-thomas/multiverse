import React from 'react';
import './App.css';

import { Row, Col } from 'react-bootstrap';

import AppHeader from './AppHeader';
import AppBody from './AppBody';

const App = () => (
  <Row style={{ height: '100vh' }} noGutters={true}>
    <Col md="auto">
      <AppHeader />
    </Col>
    <Col>
      <AppBody />
    </Col>
  </Row>
);

export default App;
