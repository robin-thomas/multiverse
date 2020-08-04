import React, { useState, useCallback } from 'react';

import Fab from '@material-ui/core/Fab';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';

import Popup from './Popup';

import styles from './Chat.module.css';

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);

  const onOpen = () => {
    setOpen((_open) => !_open);
    setHasNew(false);
  };

  const onNew = useCallback(() => {
    if (!open) {
      setHasNew(true);
    }
  }, [open, setHasNew]);

  const onClose = () => {
    setOpen(false);
    setHasNew(false);
  };

  return (
    <div className={styles['chat']}>
      <Popup open={open} onNew={onNew} onClose={onClose} />
      <Badge color="secondary" variant={`${hasNew ? 'dot' : 'standard'}`}>
        <Fab color="primary" onClick={onOpen}>
          {open ? (
            <Tooltip title="Close">
              <CloseIcon />
            </Tooltip>
          ) : (
            <Tooltip title="Chat">
              <ChatBubbleIcon />
            </Tooltip>
          )}
        </Fab>
      </Badge>
    </div>
  );
};

export default Chat;
