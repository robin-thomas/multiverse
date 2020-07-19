import React, { useEffect, useState, useContext, useRef } from 'react';

import { Row, Col, ListGroupItem } from 'react-bootstrap';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';

import Alert from './Alert';
import Bucket from '../../../utils/bucket';
import { DataContext } from '../../utils/DataProvider';
import FriendRequest from './FriendRequest';

const FriendRequests = () => {
  const ctx = useContext(DataContext);

  const simpleBar = useRef(null);

  const [head, setHead] = useState(null);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!head) {
      setCount(ctx.friendRequests.length);
    } else {
      const index = ctx.friendRequests.findIndex((e) => e.id === head);
      setCount(index);
      setHead(ctx.friendRequests[index].id);
    }

    setItems(ctx.friendRequests);

    if (simpleBar.current) {
      simpleBar.current.recalculate();
    }

    const load = async () => {
      let _items = [];
      for (const item of ctx.friendRequests) {
        let imgUrl = null;
        if (item.me.profilePic) {
          imgUrl = await Bucket.loadImage(item.me.profilePic, 100);
        }

        _items.push({ ...item, imgUrl });
      }

      setItems(_items);
    };

    if (ctx.friendRequests.length > 0) {
      load();
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
      {items.length > 0 ? (
        items.map((item, index) => (
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
