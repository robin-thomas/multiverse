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
import BlockIcon from '@material-ui/icons/Block';

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
  //  2 => approved
  //  3 => blocked
  const [pending, setPending] = useState(-1);

  useEffect(() => {
    if (_.has(ctx.profile, 'username')) {
      setName(ctx.profile.username);
    }

    if (ctx.profile.address === ctx.address) {
      setPending(0);
    } else {
      const isFriend = _.has(
        ctx.profilePrivate,
        `keys.encryptionKeys.${ctx.profile.address}`
      );
      if (isFriend) {
        setPending(2);
      } else {
        const isSent = _.has(
          ctx.profilePrivate,
          `friendRequests.${ctx.profile.address}`
        );
        if (isSent) {
          console.log(ctx.friendRequestsSent);
          const response = ctx.friendRequestsSent.find(
            (e) => e.friend.address === ctx.profile.address
          );

          if (!response) {
            setPending(0);
          } else if (response.status !== 'pending') {
            setPending(response.status === 'ok' ? 2 : 3);
          } else {
            setPending(1);
          }
        } else {
          setPending(0);
        }
      }
    }
  }, [ctx.profile, ctx.friendRequestsSent, ctx.profilePrivate]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const friendRequest = async () => {
    setOpen(false);
    setBackdropOpen(true);

    // create & send friend request.
    Box.set(Box.DATASTORE_KEY_PROFILE_PRIVATE, {
      friendRequests: {
        [ctx.profile.address]: 1,
      },
    });

    const message = {
      me: {
        username: ctx.profilePrivate.username,
        address: ctx.address,
        profilePic: ctx.profilePrivate.profilePic,
      },
      friend: {
        username: ctx.profile.username,
        address: ctx.profile.address,
        profilePic: ctx.profile.profilePic,
      },
    };

    await Box.message.request.post({
      pubKey: Box.get(
        Box.DATASTORE_KEY_PROFILE_PRIVATE,
        'keys.keypair.publicKey'
      ),
      ...message,
    });

    setPending(1);
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
          style={{ cursor: 'not-allowed' }}
          startIcon={<CircularProgress color="inherit" size={15} />}
        >
          Pending Friend
        </Button>
      ) : pending === 2 ? (
        <Button
          variant="contained"
          color="primary"
          className={styles['icon-bottom']}
          disableElevation
          startIcon={<CheckIcon />}
          style={{ cursor: 'not-allowed' }}
        >
          Friend
        </Button>
      ) : pending === 3 ? (
        <Button
          variant="contained"
          color="primary"
          className={styles['icon-bottom']}
          disableElevation
          startIcon={<BlockIcon />}
          style={{ cursor: 'not-allowed' }}
        >
          Blocked
        </Button>
      ) : null}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Send a friend request?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <strong>@{name}</strong> will need to confirm that you are friends.
            Okay?
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
