import React from 'react';

import { Container, Row, Col, ProgressBar } from 'react-bootstrap';

import styles from './Upload.module.css';

const formatNum = (num) => (isNaN(num) ? 0.0 : num);

const Footer = ({
  hiddenFileInput,
  onChange,
  readSize,
  totalSize,
  sizeH,
  multiple,
}) => (
  <Container>
    <Row>
      <Col>
        <ProgressBar
          striped
          animated
          variant="info"
          now={100 * (readSize / totalSize)}
        />
      </Col>
    </Row>
    <Row className={styles['file-upload-progress-footer']}>
      {multiple ? (
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          ref={hiddenFileInput}
          onChange={onChange}
        />
      ) : (
        <input
          type="file"
          accept="image/*"
          hidden
          ref={hiddenFileInput}
          onChange={onChange}
        />
      )}
      <Col md="3" id="file-upload-progress-total-display">
        <b>{formatNum(100.0 * (readSize / totalSize))}%</b>
      </Col>
      <Col
        md={{ span: 6, offset: 3 }}
        className={styles['file-upload-progress-total-size-display']}
      >
        Total <b>{sizeH}</b>
      </Col>
    </Row>
  </Container>
);

export default Footer;
