import React, { useContext } from 'react';

import Message from './Message';
import { DataContext } from '../DataProvider';

const Messages = ({ messages }) => {
  const ctx = useContext(DataContext);

  return messages.map((message, index) => (
    <Message
      key={index}
      message={message.message.message}
      profilePic={ctx.profilePics[message.message.address]}
      sent={message.message.address === ctx.address}
    />
  ));
};

export default Messages;
