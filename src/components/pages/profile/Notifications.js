import React, { useEffect, useState, useContext, useRef } from 'react';

import { Row, Col, ListGroupItem } from 'react-bootstrap';
import NotificationsIcon from '@material-ui/icons/Notifications';

import Alert from './Alert';
import Notification from './Notification';
import Bucket from '../../../utils/bucket';
import { DataContext } from '../../utils/DataProvider';

const Notifications = () => {
  const ctx = useContext(DataContext);

  const simpleBar = useRef(null);

  const [head, setHead] = useState(null);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!head) {
      setCount(ctx.friendRequestsSent.length);
    } else {
      const index = ctx.friendRequestsSent.findIndex((e) => e.id === head);
      setCount(index);
      setHead(ctx.friendRequestsSent[index].id);
    }

    setItems(ctx.friendRequestsSent);

    if (simpleBar.current) {
      simpleBar.current.recalculate();
    }

    const load = async () => {
      let _items = [];
      for (const item of ctx.friendRequestsSent) {
        let imgUrl = null;
        if (item.friend.profilePic) {
          imgUrl = await Bucket.loadImage(item.friend.profilePic, 100);
        }

        _items.push({ ...item, imgUrl });
      }

      setItems(_items);
    };

    if (ctx.friendRequestsSent.length > 0) {
      load();
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
      {items.length > 0 ? (
        items.map((item, index) => (
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
