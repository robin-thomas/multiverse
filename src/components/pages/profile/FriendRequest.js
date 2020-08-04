import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, ListGroupItem } from 'react-bootstrap';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { green } from '@material-ui/core/colors';

import { DataContext } from '../../utils/DataProvider';
import Box from '../../../utils/3box';
import Crypto from '../../../utils/crypto';

import styles from './Alert.module.css';

const FriendRequest = ({ search, message, setOpen, onClick }) => {
  const ctx = useContext(DataContext);

  const accept = async () => {
    if (window.confirm('Are you sure you want to accept?')) {
      ctx.setBackdropOpen((_open) => !_open);

      // Encrypt the encryptionKey using the pubKey.
      const encryptionKey = Crypto.box.encryptionKey(ctx.address);
      console.debug('encryptionKey', encryptionKey);

      const nonce = Crypto.asymmetric.genNonce().toString();
      const encryptedKey = Crypto.asymmetric.encrypt(encryptionKey, nonce, {
        publicKey: message.pubKey,
        secretKey: Crypto.box.secretKey(),
      });

      // Create a chat thread.
      const thread = await Box.message.createChatThread(
        message.me.address,
        message.me.username,
        message.friend.username
      );

      Box.set(Box.DATASTORE_KEY_PROFILE_PRIVATE, {
        chats: {
          [message.me.address]: thread,
        },
      });

      Box.set(Box.DATASTORE_KEY_PROFILE_PUBLIC, {
        friends: {
          [message.me.address]: {
            username: message.me.username,
          },
        },
      });

      await Box.message.response.post({
        thread,
        encryptedKey,
        pubKey: Crypto.box.publicKey(),
        nonce,
        me: message.friend,
        friend: message.me,
      });

      setOpen((_open) => !_open);
      ctx.setBackdropOpen((_open) => !_open);
    }
  };

  const reject = async () => {
    if (window.confirm('Are you sure you want to reject?')) {
      ctx.setBackdropOpen((_open) => !_open);

      console.log('reject', message);

      await Box.message.response.post({
        denied: true,
        me: message.friend,
        friend: message.me,
      });

      setOpen((_open) => !_open);
      ctx.setDenied((_denied) => !_denied);
      ctx.setBackdropOpen((_open) => !_open);
    }
  };

  return (
    <ListGroupItem onClick={onClick ? onClick : () => {}}>
      <Row>
        <Col md="auto" className="pr-0">
          <Avatar
            alt={message.me.username}
            src={ctx.profilePics[message.me.address]}
          />
        </Col>
        <Col md="6" className="align-self-center pr-0">
          <Row noGutters={true}>
            <Col>
              <Link
                to={`/profile/${message.me.address}`}
                className={styles['name']}
              >
                @{message.me.username}
              </Link>
            </Col>
          </Row>
          <Row noGutters={true}>
            <Col className={styles['send-request']}>
              {search ? message.me.address : 'sent a friend request'}
            </Col>
          </Row>
        </Col>
        {!search ? (
          <Col md="auto" className="px-0">
            <Row noGutters={true}>
              <Col md="auto">
                <Tooltip title="Accept">
                  <IconButton
                    className={styles['request-btn']}
                    onClick={accept}
                  >
                    <CheckCircleOutlineIcon
                      fontSize="large"
                      style={{ color: green[500] }}
                    />
                  </IconButton>
                </Tooltip>
              </Col>
              <Col md="auto">
                <Tooltip title="Reject">
                  <IconButton
                    className={styles['request-btn']}
                    onClick={reject}
                  >
                    <HighlightOffIcon fontSize="large" color="secondary" />
                  </IconButton>
                </Tooltip>
              </Col>
            </Row>
          </Col>
        ) : null}
      </Row>
    </ListGroupItem>
  );
};

export default FriendRequest;
