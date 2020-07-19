import React from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, ListGroupItem } from 'react-bootstrap';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import Box from '../../../utils/3box/index.js';

import styles from './Alert.module.css';

const BlockedPerson = ({ message, setOpen, onClick }) => {
  const remove = async () => {
    if (window.confirm('Are you sure you want to remoove the block?')) {
      Box.message.response.deleteById(message.id);

      setOpen((_open) => !_open);
    }
  };

  return (
    <ListGroupItem onClick={onClick}>
      <Row>
        <Col md="auto" className="pr-0">
          <Avatar
            alt={message.friend.username}
            src="/static/images/avatar/1.jpg"
          />
        </Col>
        <Col md="6" className="align-self-center pr-0">
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
        </Col>
        <Col md="auto" className="ml-auto">
          <Row noGutters={true}>
            <Col md="auto">
              <Tooltip title="Unblock">
                <IconButton className={styles['request-btn']} onClick={remove}>
                  <HighlightOffIcon fontSize="large" color="secondary" />
                </IconButton>
              </Tooltip>
            </Col>
          </Row>
        </Col>
      </Row>
    </ListGroupItem>
  );
};

export default BlockedPerson;
