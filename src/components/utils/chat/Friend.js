import React, { useState, useEffect, useContext } from 'react';

import { Row, Col } from 'react-bootstrap';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';

import Box from '../../../utils/3box';
import { DataContext } from '../DataProvider';

import styles from './Content.module.css';

const Friend = ({
  address,
  username,
  profilePic,
  setMessages,
  onClick,
  onNew,
}) => {
  const ctx = useContext(DataContext);

  const [thread, setThread] = useState(null);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    const fn = async () => {
      const _address = ctx.profilePrivate.chats[address];
      const _thread = await Box.message.joinThreadByAddress(_address);
      setThread(_thread);

      const _messages = await _thread.getPosts();
      setMessages(_messages);

      _thread.onUpdate(() => {
        onNew();
        setHasNew(true);
        _thread.getPosts().then(setMessages);
      });
    };

    fn();
  }, []);

  const click = () => {
    onClick({ address, username, chatThread: thread });
    setHasNew(false);
  };

  return (
    <div className={styles['friend']} onClick={click}>
      <Row>
        <Col md="auto" className="align-self-center">
          <Tooltip title={address}>
            <Avatar alt={username} src={profilePic} />
          </Tooltip>
        </Col>
        <Col className="align-self-center">
          {hasNew ? (
            <div className={styles['bold-user']}>{username}</div>
          ) : (
            username
          )}
        </Col>
        {hasNew ? (
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
};

export default Friend;
