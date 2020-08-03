import React, { useEffect, useState, useContext, useRef } from 'react';

import { Row, Col, ListGroupItem } from 'react-bootstrap';
import NotificationsIcon from '@material-ui/icons/Notifications';

import Alert from './Alert';
import Notification from './Notification';
import Box from '../../../utils/3box';
import File from '../../../utils/file';
import { DataContext } from '../../utils/DataProvider';

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

    const load = async () => {
      for (const item of ctx.friendRequestsSent) {
        if (!ctx.profilePics[item.friend.address]) {
          const data = await Box.getAllPublic(item.friend.address);
          const pic = Box.get(
            Box.DATASTORE_KEY_PROFILE_PUBLIC,
            'profilePic',
            data
          );

          if (pic) {
            const imgUrl = await File.avatar(pic);

            ctx.setProfilePics((_pics) => {
              return {
                ..._pics,
                [item.friend.address]: imgUrl,
              };
            });
          }
        }
      }
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
      {ctx.friendRequestsSent.length > 0 ? (
        ctx.friendRequestsSent.map((item) => (
          <Notification key={item.id} message={item} setOpen={setOpen} />
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
