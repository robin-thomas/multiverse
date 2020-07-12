import React, { useState, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import Box from '../../../utils/3box';

import styles from './FriendRequest.module.css';

const FriendRequest = ({ profile }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(null);
  const [backdropOpen, setBackdropOpen] = useState(false);

  useEffect(() => {
    if (profile[Box.DATASTORE_KEY_USERNAME]) {
      setName(profile[Box.DATASTORE_KEY_USERNAME]);
    }
  }, [profile]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const friendRequest = async () => {
    setOpen(false);
    setBackdropOpen(true);

    const redirect = () => {
      setBackdropOpen(false);
    };

    // TODO: create & send friend request.

    // fake delay.
    const sleep = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, 1000 * ms));
    };
    sleep(5).then(redirect);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        className={styles['icon-bottom']}
        onClick={handleClickOpen}
      >
        Add as friend
      </Button>
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
