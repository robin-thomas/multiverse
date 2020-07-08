import React from 'react';
import './App.css';

import { Row, Col } from 'react-bootstrap';

import AppHeader from './AppHeader';
import AppBody from './AppBody';

const App = () => (
  <>
    <AppHeader />
    <Row style={{ height: '100vh' }} noGutters={true}>
      <Col>
        <AppBody />
      </Col>
    </Row>
  </>
);

export default App;
