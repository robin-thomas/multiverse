import React, { useRef, useState, useEffect } from 'react';

import { Row, Col } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';

import Messages from './Messages';

import styles from './Content.module.css';

const Friend = ({ address, username, profilePic, onClick, hasNewMessages }) => (
  <div className={styles['friend']} onClick={onClick}>
    <Row>
      <Col md="auto" className="align-self-center">
        <Tooltip title={address}>
          <Avatar alt={username} src={profilePic} />
        </Tooltip>
      </Col>
      <Col className="align-self-center">
        {hasNewMessages ? (
          <div className={styles['bold-user']}>{username}</div>
        ) : (
          username
        )}
      </Col>
      {hasNewMessages ? (
        <Col md="auto" className="align-self-center">
          <Chip
            icon={<FaceIcon />}
            label="new"
            color="secondary"
            variant="outlined"
          />
        </Col>
      ) : null}
    </Row>
  </div>
);

const Content = ({ state, onClick }) => {
  const simpleBar = useRef(null);

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const _f = [];
    for (let i = 0; i < 15; ++i) {
      _f.push({ username: 'robin', profilePic: '', address: '0x' });
    }
    setFriends(_f);
  }, []);

  return (
    <SimpleBar ref={simpleBar} className={styles['content']}>
      {state === 0 ? (
        friends.map((friend, index) => (
          <Friend key={index} {...friend} onClick={() => onClick(friend)} />
        ))
      ) : (
        <Messages />
      )}
    </SimpleBar>
  );
};

export default Content;
