import React, { useEffect, useState, useContext, useRef } from 'react';

import _ from 'lodash';
import { Row, Col, ListGroupItem } from 'react-bootstrap';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';

import Alert from './Alert';
import File from '../../../utils/file';
import { DataContext } from '../../utils/DataProvider';
import FriendRequest from './FriendRequest';

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

    const load = async () => {
      for (const item of ctx.friendRequests) {
        if (!ctx.profilePics[item.me.address] && _.has(item.me, 'profilePic')) {
          const imgUrl = await File.avatar(item.me.profilePic);

          ctx.setProfilePics((_pics) => {
            return {
              ..._pics,
              [item.me.address]: imgUrl,
            };
          });
        }
      }
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
