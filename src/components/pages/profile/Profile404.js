import React from 'react';

import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { Row, Col } from 'react-bootstrap';

import Content from '../../app/Content';

const Profile404 = () => (
  <Content>
    <Row style={{ height: '100vh' }}>
      <Col md="3" className="align-self-center mx-auto">
        <Alert severity="error">
          <AlertTitle>Oops! Profile not found</AlertTitle>
        </Alert>
      </Col>
    </Row>
  </Content>
);

export default Profile404;
