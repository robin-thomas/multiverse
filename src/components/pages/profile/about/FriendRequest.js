import React, { useState, useEffect, useContext } from 'react';

import _ from 'lodash';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';

import Box from '../../../../utils/3box/index.js';
import { DataContext } from '../../../utils/DataProvider';

import styles from './FriendRequest.module.css';

const FriendRequest = () => {
  const ctx = useContext(DataContext);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(null);
  const [backdropOpen, setBackdropOpen] = useState(false);

  // -1 => loading
  //  0 => no pending
  //  1 => pending
  const [pending, setPending] = useState(-1);

  useEffect(() => {
    if (_.has(ctx.profile, 'username')) {
      setName(ctx.profile.username);
    }

    // Check and see if a friend request is already sent to this user.
    const _pending = Box.get(Box.DATASTORE_PENDING_SENT_REQUESTS, '');
    if (_pending) {
      if (_pending[ctx.profile.address]) {
        setPending(1);
      } else {
        setPending(0);
      }
    }
  }, [ctx.profile]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const friendRequest = async () => {
    setOpen(false);
    setBackdropOpen(true);

    // create & send friend request.
    Box.set(
      Box.DATASTORE_PENDING_SENT_REQUESTS,
      {
        key: ctx.profile.address,
        value: 1,
      },
      Box.state.PUBLIC
    );

    await Box.message.request.post(
      {
        pubKey: '', // TODO.
        username: ctx.profile[Box.DATASTORE_KEY_USERNAME],
        address: ctx.address,
        friend: ctx.profile.address,
      },
      { address: ctx.address }
    );

    setBackdropOpen(false);
  };

  return (
    <>
      {!ctx.editable && ctx.address && pending === 0 ? (
        <Button
          variant="contained"
          color="primary"
          className={styles['icon-bottom']}
          onClick={handleClickOpen}
        >
          Add as friend
        </Button>
      ) : pending === 1 ? (
        <Button
          variant="contained"
          color="primary"
          className={styles['icon-bottom']}
          disableElevation
          startIcon={<CheckIcon />}
        >
          Pending Friend
        </Button>
      ) : null}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Send a friend request?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {name} will need to confirm that you are friends.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={friendRequest} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop className={styles['backdrop']} open={backdropOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default FriendRequest;
