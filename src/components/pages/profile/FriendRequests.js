import React, { useEffect, useState, useContext } from 'react';

import { Row, Col, ListGroupItem } from 'react-bootstrap';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';

import { DataContext } from '../../utils/DataProvider';
import FriendRequest from './FriendRequest';
import Alert from './Alert';

const FriendRequests = ({ setBackdropOpen }) => {
  const ctx = useContext(DataContext);

  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCount(ctx.friendRequests.length);
  });

  return (
    <Alert
      title="Friend Requests"
      count={count}
      open={open}
      setOpen={setOpen}
      icon={<PermContactCalendarIcon fontSize="large" />}
    >
      {ctx.friendRequests.length > 0 ? (
        ctx.friendRequests.map((item, index) => (
          <FriendRequest
            key={index}
            message={item}
            setOpen={setOpen}
            setBackdropOpen={setBackdropOpen}
          />
        ))
      ) : (
        <ListGroupItem>
          <Row>
            <Col>None! Please check back later</Col>
          </Row>
        </ListGroupItem>
      )}
    </Alert>
  );
};

export default FriendRequests;
