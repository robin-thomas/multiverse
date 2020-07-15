import React, { useEffect, useState, useContext } from 'react';

import { Row, Col, ListGroupItem } from 'react-bootstrap';
import NotificationsIcon from '@material-ui/icons/Notifications';

import { DataContext } from '../../utils/DataProvider';
import Notification from './Notification';
import Alert from './Alert';

const Notifications = ({ setBackdropOpen }) => {
  const ctx = useContext(DataContext);

  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCount(ctx.friendRequestsSent.length);
  });

  return (
    <Alert
      title="Notifications"
      count={count}
      open={open}
      setOpen={setOpen}
      icon={<NotificationsIcon fontSize="large" />}
    >
      {ctx.friendRequestsSent.length > 0 ? (
        ctx.friendRequestsSent.map((item, index) => (
          <Notification
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

export default Notifications;
