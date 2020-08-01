import React from 'react';

import { Row, Col } from 'react-bootstrap';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

import styles from './PostFooter.module.css';

const Like = ({ like, profilePic }) => (
  <Row>
    <Col md="auto" className="pr-0">
      <Tooltip title={like.message.address}>
        <Avatar alt={like.message.username} src={profilePic} />
      </Tooltip>
    </Col>
    <Col md="6" className="align-self-center pr-0">
      @{like.message.username}
    </Col>
    <Col md="4" className="align-self-center ml-auto text-right">
      <span className={styles['timestamp']}>
        {new Date(like.timestamp * 1000).toLocaleString()}
      </span>
    </Col>
  </Row>
);

export default Like;
