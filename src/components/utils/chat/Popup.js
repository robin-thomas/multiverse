import React, { useState, useContext } from 'react';

import { Row, Col } from 'react-bootstrap';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Avatar from '@material-ui/core/Avatar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import InputBase from '@material-ui/core/InputBase';

import Content from './Content';
import { DataContext } from '../DataProvider';

import styles from './Popup.module.css';

const Header = ({ title, state, onBack, onClose, username, profilePic }) => (
  <div className={styles['header']}>
    <Row>
      <Col md="auto" className="align-self-center">
        {state === 0 ? (
          <Avatar alt={username} src={profilePic} />
        ) : (
          <IconButton
            color="default"
            component="span"
            className={styles['close']}
            onClick={onBack}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
      </Col>
      <Col className="align-self-center text-center">
        <div className={styles['title']}>{title}</div>
      </Col>
      <Col md="auto" className="align-self-center">
        <IconButton
          color="default"
          component="span"
          className={styles['close']}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </Col>
    </Row>
  </div>
);

const Footer = ({ state, thread, address }) => {
  const [message, setMessage] = useState('');
  const [active, setActive] = useState(false);

  const submitMessage = async () => {
    await thread.post({ address, message });
    setMessage('');
  };

  const typeMessage = (e) => {
    if (message.length === 100 && e.keyCode !== 8) {
      return;
    }

    setMessage(e.target.value);
  };

  const onKeyDown = async (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      await submitMessage();
    }
  };

  return state === 0 ? (
    <div className={styles['footer']}>You can chat only with your friends</div>
  ) : (
    <div className={styles['footer']}>
      <div
        className={styles[`${active ? 'input-form-active' : ''}`]}
        style={{ padding: '0 20px' }}
      >
        <InputBase
          fullWidth
          autoFocus={true}
          value={message}
          onChange={typeMessage}
          onKeyDown={onKeyDown}
          placeholder="Write a reply..."
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
        />
      </div>
    </div>
  );
};

const Popup = ({ open, onNew, onClose }) => {
  const ctx = useContext(DataContext);

  const [state, setState] = useState(0);
  const [thread, setThread] = useState(null);
  const [title, setTitle] = useState('Chat');

  const onClick = ({ address, username, chatThread }) => {
    setTitle(username);
    setState(1);
    setThread(chatThread);
  };

  const onBack = () => {
    setState(0);
    setTitle('Chat');
  };

  return (
    <div
      className={styles['popup']}
      style={{ visibility: open ? 'visible' : 'hidden' }}
    >
      <Header
        state={state}
        title={title}
        username={ctx.profile.username}
        profilePic={ctx.profilePics[ctx.address]}
        onClose={onClose}
        onBack={onBack}
      />
      <Content onClick={onClick} state={state} onNew={onNew} />
      <Footer state={state} thread={thread} address={ctx.address} />
    </div>
  );
};

export default Popup;
