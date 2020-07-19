import React from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, ListGroupItem } from 'react-bootstrap';
import Avatar from '@material-ui/core/Avatar';

import Timer from '../../utils/Timer';

import styles from './Alert.module.css';

const Notification = ({ message, setOpen }) => {
  return (
    <ListGroupItem>
      <Row>
        <Col md="auto" className="pr-0">
          <Avatar
            alt={message.friend.username}
            src={message.friend.imgUrl ? message.friend.imgUrl : null}
          />
        </Col>
        <Col className="align-self-center">
          <Row noGutters={true}>
            <Col>
              <Link
                to={`/profile/${message.friend.address}`}
                className={styles['name']}
              >
                @{message.friend.username}
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
        <Row>
          <Col className={styles['send-request']}>
            <Timer time={message.timestamp} />
          </Col>
        </Row>
      </Row>
    </ListGroupItem>
  );
};

export default Notification;
