import React from 'react';

import { MDBIcon } from 'mdbreact';
import { Row, Col } from 'react-bootstrap';
import Alert from '@material-ui/lab/Alert';

import EmptyRow from '../../utils/EmptyRow';

const Empty = () => (
  <>
    <EmptyRow />
    <Row>
      <Col className="text-center">
        <MDBIcon
          icon="exclamation-circle"
          size="3x"
          style={{ marginBottom: '10px' }}
        />
      </Col>
    </Row>
    <Row>
      <Col className="text-center">
        <h2>Nothing to upload yet.</h2>
      </Col>
    </Row>
    <EmptyRow rows={2} />
    <Row>
      <Col className="text-center">
        <Alert severity="info">
          <b>Duplicate images</b> will not be re-uploaded unless removed first
        </Alert>
      </Col>
    </Row>
  </>
);

export default Empty;
