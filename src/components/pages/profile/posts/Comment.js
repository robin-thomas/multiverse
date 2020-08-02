import React, { useState } from 'react';

import { Row, Col } from 'react-bootstrap';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';

import Box from '../../../../utils/3box';

const Comment = ({ username, address, tAddress, profilePic }) => {
  const [comment, setComment] = useState('');
  const [disabled, setDisabled] = useState(false);

  const onChange = (e) => {
    if (comment.length < 100) {
      setComment(e.target.value);
    }
  };

  const onKeyDown = async (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      await submitComment();
    }
  };

  const submitComment = async () => {
    setDisabled(true);
    const thread = await Box.message.joinThreadByAddress(tAddress);
    await thread.post({ address, username, comment });
    setComment('');
    setDisabled(false);
  };

  return address !== null ? (
    <Row style={{ marginTop: '15px' }}>
      <Col md="auto" className="align-self-center">
        <Avatar alt={username} src={profilePic} />
      </Col>
      <Col className="align-self-center pl-0">
        <TextField
          multiline
          value={comment}
          onChange={onChange}
          onKeyDown={onKeyDown}
          rows={2}
          rowsMax={4}
          fullWidth
          disabled={disabled}
          label="Write a comment"
          variant="outlined"
        />
      </Col>
    </Row>
  ) : null;
};

export default Comment;
