import React from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, ListGroupItem } from 'react-bootstrap';
import Avatar from '@material-ui/core/Avatar';

import styles from './Alert.module.css';

const Notification = ({ message, setOpen, setBackdropOpen }) => {
  return (
    <ListGroupItem>
      <Row>
        <Col md="auto" className="pr-0">
          <Avatar alt={message.username} src="/static/images/avatar/1.jpg" />
        </Col>
        <Col className="align-self-center">
          <Row noGutters={true}>
            <Col>
              <Link
                to={`/profile/${message.address}`}
                className={styles['name']}
              >
                @{message.username}
              </Link>
            </Col>
          </Row>
          <Row noGutters={true}>
            {message.status === 'ok' ? (
              <Col className={styles['send-request']}>
                accepted your friend request
              </Col>
            ) : message.status === 'denied' ? (
              <Col className={styles['send-request']}>denied your request</Col>
            ) : (
              <Col className={styles['send-request']}>
                pending friend request
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </ListGroupItem>
  );
};

export default Notification;
