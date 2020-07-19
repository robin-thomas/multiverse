import React, { useEffect, useState, useContext, useRef } from 'react';

import { Row, Col, ListGroupItem } from 'react-bootstrap';
import BlockIcon from '@material-ui/icons/Block';

import Alert from './Alert';
import Box from '../../../utils/3box';
import Bucket from '../../../utils/bucket';
import { DataContext } from '../../utils/DataProvider';
import BlockedPerson from './BlockedPerson';

const BlockedPersons = () => {
  const ctx = useContext(DataContext);

  const simpleBar = useRef(null);

  const [head, setHead] = useState(null);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [denied, setDenied] = useState([]);

  useEffect(() => {
    console.log('denied', Box.message.response.items);

    const results = Box.message.response.items
      .filter((e) => e.message.denied && e.message.me.address === ctx.address)
      .map((e) => {
        return {
          id: e.postId,
          ...e.message,
          timestamp: e.timestamp,
        };
      })
      .reverse();

    if (!head) {
      setCount(results.length);
    } else {
      const index = results.findIndex((e) => e.id === head);
      setCount(index);
      setHead(results[index].id);
    }

    setDenied(results);

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

      setDenied(_items);
    };

    if (results > 0) {
      load();
    }
  }, [ctx.friendRequests]);

  return (
    <Alert
      title="Blocked"
      count={count}
      setCount={setCount}
      open={open}
      setOpen={setOpen}
      simplebar={simpleBar}
      icon={<BlockIcon fontSize="large" />}
    >
      {denied.length > 0 ? (
        denied.map((item, index) => (
          <BlockedPerson key={index} message={item} setOpen={setOpen} />
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

export default BlockedPersons;
