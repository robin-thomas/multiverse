import React, { useState } from 'react';

import Fab from '@material-ui/core/Fab';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';

import Popup from './Popup';

import styles from './Chat.module.css';

const Chat = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles['chat']}>
      {open ? (
        <Popup username="robinthomas" onClose={() => setOpen(false)} />
      ) : null}
      <Fab color="primary" onClick={() => setOpen((_open) => !_open)}>
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
    </div>
  );
};

export default Chat;
