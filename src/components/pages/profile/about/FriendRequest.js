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
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';

import Box from '../../../../utils/3box';
import Crypto from '../../../../utils/crypto';
import { DataContext } from '../../../utils/DataProvider';

import styles from './FriendRequest.module.css';

const FriendRequest = ({ pending, setPending }) => {
  const ctx = useContext(DataContext);

  const [open, setOpen] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);

  useEffect(() => {
    if (!ctx.address || ctx.profile.address === ctx.address) {
      setPending(4);
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
          const response = ctx.friendRequestsSent.find(
            (e) => e.friend.address === ctx.profile.address
          );

          if (!response) {
            setPending(1);
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
      },
      friend: {
        username: ctx.profile.username,
        address: ctx.profile.address,
      },
    };

    await Box.message.request.post({
      pubKey: Crypto.box.publicKey(),
      ...message,
    });

    setPending(1);
    setBackdropOpen(false);
  };

  const getTitle = (_pending) => {
    switch (_pending) {
      case 0:
        return 'Add as friend';

      default:
        return '';
    }
  };

  return pending === 0 || pending === -1 ? (
    <>
      <Tooltip title={getTitle(pending)}>
        <IconButton
          color="primary"
          component="span"
          onClick={handleClickOpen}
          disabled={pending !== 0}
        >
          <PermContactCalendarIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Send a friend request?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <strong>@{ctx.profile.username}</strong> will need to confirm that
            you are friends. Okay?
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
  ) : null;
};

export default FriendRequest;
