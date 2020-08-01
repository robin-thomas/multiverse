import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import { Row, Col } from 'react-bootstrap';

import styles from './Message.module.css';

const Message = ({ profilePic, message, timestamp, sent }) => (
  <>
    <Row className={styles['row']}>
      {sent ? (
        <Col md="auto" className="align-self-center">
          <Avatar src={profilePic} />
        </Col>
      ) : null}
      <Col className="align-self-center">
        <div className={styles[`message-${sent ? 'sent' : 'received'}`]}>
          {message}
        </div>
      </Col>
      {!sent ? (
        <Col md="auto" className="align-self-center">
          <Avatar src={profilePic} />
        </Col>
      ) : null}
    </Row>
    <Row>
      <Col md="auto" className={`${sent ? 'mr-auto' : 'ml-auto'}`}>
        <span className={styles['timestamp']}>
          {new Date(timestamp * 1000).toLocaleString()}
        </span>
      </Col>
    </Row>
  </>
);

export default Message;
