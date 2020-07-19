import React, { useEffect, useState, useContext, useRef } from 'react';

import { Row, Col, ListGroupItem } from 'react-bootstrap';
import NotificationsIcon from '@material-ui/icons/Notifications';

import { DataContext } from '../../utils/DataProvider';
import Notification from './Notification';
import Alert from './Alert';

const Notifications = () => {
  const ctx = useContext(DataContext);

  const simpleBar = useRef(null);

  const [head, setHead] = useState(null);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!head) {
      setCount(ctx.friendRequestsSent.length);
    } else {
      const index = ctx.friendRequestsSent.findIndex((e) => e.id === head);
      setCount(index);
      setHead(ctx.friendRequestsSent[index].id);
    }

    if (simpleBar.current) {
      simpleBar.current.recalculate();
    }
  }, [ctx.friendRequestsSent]);

  return (
    <Alert
      title="Notifications"
      count={count}
      setCount={setCount}
      open={open}
      setOpen={setOpen}
      simpleBar={simpleBar}
      icon={<NotificationsIcon fontSize="large" />}
    >
      {ctx.friendRequestsSent.length > 0 ? (
        ctx.friendRequestsSent.map((item, index) => (
          <Notification key={index} message={item} setOpen={setOpen} />
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

export default Notifications;
