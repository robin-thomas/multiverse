import React, { useEffect, useState, useContext, useRef } from 'react';

import { Row, Col, ListGroupItem } from 'react-bootstrap';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';

import { DataContext } from '../../utils/DataProvider';
import FriendRequest from './FriendRequest';
import Alert from './Alert';

const FriendRequests = () => {
  const ctx = useContext(DataContext);

  const simpleBar = useRef(null);

  const [head, setHead] = useState(null);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!head) {
      setCount(ctx.friendRequests.length);
    } else {
      const index = ctx.friendRequests.findIndex((e) => e.id === head);
      setCount(index);
      setHead(ctx.friendRequests[index].id);
    }

    if (simpleBar.current) {
      simpleBar.current.recalculate();
    }
  }, [ctx.friendRequests]);

  return (
    <Alert
      title="Friend Requests"
      count={count}
      setCount={setCount}
      open={open}
      setOpen={setOpen}
      simplebar={simpleBar}
      icon={<PermContactCalendarIcon fontSize="large" />}
    >
      {ctx.friendRequests.length > 0 ? (
        ctx.friendRequests.map((item, index) => (
          <FriendRequest key={index} message={item} setOpen={setOpen} />
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
