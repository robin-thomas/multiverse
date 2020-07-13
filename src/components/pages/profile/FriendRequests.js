import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { green } from '@material-ui/core/colors';

import { DataContext } from '../../utils/DataProvider';

import styles from './FriendRequests.module.css';

const useStyles = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.white,
  },
  tooltip: {
    backgroundColor: 'transparent',
    maxWidth: 350,
  },
}));

const NTooltip = (props) => {
  const classes = useStyles();
  return <Tooltip {...props} arrow interactive classes={classes} />;
};

const FriendRequest = ({ username, address, setOpen, setBackdropOpen }) => {
  const sleep = (s) => {
    return new Promise((resolve) => setTimeout(resolve, 1000 * s));
  };

  const accept = async () => {
    setBackdropOpen((_open) => !_open);

    await sleep(5);
    console.log('accepted');
    setOpen((_open) => !_open);
    setBackdropOpen((_open) => !_open);
  };

  const reject = async () => {
    setBackdropOpen((_open) => !_open);

    await sleep(5);
    console.log('rejected');
    setOpen((_open) => !_open);
    setBackdropOpen((_open) => !_open);
  };

  return (
    <ListGroupItem>
      <Row>
        <Col md="auto" className="pr-0">
          <Avatar alt={username} src="/static/images/avatar/1.jpg" />
        </Col>
        <Col md="6" className="align-self-center pr-0">
          <Row noGutters={true}>
            <Col>
              <Link to={`/profile/${address}`} className={styles['name']}>
                @{username}
              </Link>
            </Col>
          </Row>
          <Row noGutters={true}>
            <Col className={styles['send-request']}>sent a friend request</Col>
          </Row>
        </Col>
        <Col md="auto" className="px-0">
          <Row noGutters={true}>
            <Col md="auto">
              <IconButton
                className={styles['request-btn']}
                title="Accept"
                onClick={accept}
              >
                <CheckCircleOutlineIcon
                  fontSize="large"
                  style={{ color: green[500] }}
                />
              </IconButton>
            </Col>
            <Col md="auto">
              <IconButton
                className={styles['request-btn']}
                title="Reject"
                onClick={reject}
              >
                <HighlightOffIcon fontSize="large" color="secondary" />
              </IconButton>
            </Col>
          </Row>
        </Col>
      </Row>
    </ListGroupItem>
  );
};

const FriendRequests = ({ setBackdropOpen }) => {
  const ctx = useContext(DataContext);

  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCount(ctx.friendRequests.length);
  });

  return (
    <>
      <NTooltip
        open={open}
        title={
          <Card style={{ width: '350px' }}>
            <Card.Header className={styles['card-title']}>
              Friend Requests
            </Card.Header>
            <Card.Body className={styles['card-body']}>
              <ListGroup className="list-group-flush">
                {ctx.friendRequests.length > 0 ? (
                  ctx.friendRequests.map((item, index) => (
                    <FriendRequest
                      key={index}
                      username={item.username}
                      address={item.address}
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
              </ListGroup>
            </Card.Body>
          </Card>
        }
        enterDelay={200}
        leaveDelay={200}
        onClose={() => setOpen(false)}
        placement="bottom-end"
        disableFocusListener
      >
        <Badge badgeContent={count} color="secondary">
          <IconButton
            color="primary"
            title="Friend Requests"
            onClick={() => setOpen(!open)}
          >
            <PermContactCalendarIcon fontSize="large" />
          </IconButton>
        </Badge>
      </NTooltip>
    </>
  );
};

export default FriendRequests;
