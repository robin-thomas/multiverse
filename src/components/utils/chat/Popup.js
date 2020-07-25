import React, { useState } from 'react';

import { Row, Col } from 'react-bootstrap';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Avatar from '@material-ui/core/Avatar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Content from './Content';

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

const Footer = ({ state }) => {
  const [message, setMessage] = useState('');
  const [active, setActive] = useState(false);

  const submitMessage = (e) => {};

  const onKeyDown = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      submitMessage(e);
    }

    // set char limit.
    if (e.target.innerHTML.length === 100 && e.keyCode != 8) {
      e.preventDefault();
    }
  };

  return state === 0 ? (
    <div className={styles['footer']}>You can chat only with your friends</div>
  ) : (
    <div className={styles['footer']}>
      <div className={styles[`${active ? 'input-form-active' : ''}`]}>
        <div
          role="button"
          tabIndex="0"
          contentEditable="true"
          placeholder="Write a reply..."
          className={styles['input']}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  );
};

const Popup = ({ onClose, username, profilePic }) => {
  const [state, setState] = useState(0);
  const [title, setTitle] = useState('Chat');

  const onClick = ({ address, username }) => {
    setTitle(username);
    setState(1);
  };

  const onBack = () => {
    setState(0);
    setTitle('Chat');
  };

  return (
    <div className={styles['popup']}>
      <Header
        state={state}
        title={title}
        username={username}
        profilePic={profilePic}
        onClose={onClose}
        onBack={onBack}
      />
      <Content onClick={onClick} state={state} />
      <Footer state={state} />
    </div>
  );
};

export default Popup;
