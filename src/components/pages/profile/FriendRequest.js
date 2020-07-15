import React from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, ListGroupItem } from 'react-bootstrap';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { green } from '@material-ui/core/colors';

import Box from '../../../utils/3box/index.js';

import styles from './Alert.module.css';

const FriendRequest = ({ message, setOpen, setBackdropOpen }) => {
  const accept = async () => {
    setBackdropOpen((_open) => !_open);

    // Encrypt the encryptionKey using the pubKey.
    const encryptionKey = Box.get(
      Box.DATASTORE_KEY_PROFILE_PRIVATE,
      `keys.encryptionKeys.${message.friend}`
    );

    const nonce = Box.asymmetric.genNonce().toString();
    const encryptedKey = Box.crypto.asymmetric.encrypt(encryptionKey, nonce, {
      publicKey: message.pubKey,
      secretKey: Box.get(
        Box.DATASTORE_KEY_PROFILE_PRIVATE,
        'keys.keypair.secretKey'
      ),
    });

    await Box.message.response.post({
      encryptedKey,
      pubKey: Box.get(
        Box.DATASTORE_KEY_PROFILE_PRIVATE,
        'keys.keypair.publicKey'
      ),
      nonce,
      username: Box.get(Box.DATASTORE_KEY_PROFILE_PUBLIC, 'username'),
      address: message.friend,
      friend: message.address,
    });

    setOpen((_open) => !_open);
    setBackdropOpen((_open) => !_open);
  };

  const reject = async () => {
    setBackdropOpen((_open) => !_open);

    await Box.message.response.post({
      denied: true,
      address: message.friend,
      friend: message.address,
    });

    setOpen((_open) => !_open);
    setBackdropOpen((_open) => !_open);
  };

  return (
    <ListGroupItem>
      <Row>
        <Col md="auto" className="pr-0">
          <Avatar alt={message.username} src="/static/images/avatar/1.jpg" />
        </Col>
        <Col md="6" className="align-self-center pr-0">
          <Row noGutters={true}>
            <Col>
              <Link
                to={`/profile/${message.address}`}
                className={styles['name']}
              >
                @{message.username}
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
              <Tooltip title="Accept">
                <IconButton className={styles['request-btn']} onClick={accept}>
                  <CheckCircleOutlineIcon
                    fontSize="large"
                    style={{ color: green[500] }}
                  />
                </IconButton>
              </Tooltip>
            </Col>
            <Col md="auto">
              <Tooltip title="Reject">
                <IconButton className={styles['request-btn']} onClick={reject}>
                  <HighlightOffIcon fontSize="large" color="secondary" />
                </IconButton>
              </Tooltip>
            </Col>
          </Row>
        </Col>
      </Row>
    </ListGroupItem>
  );
};

export default FriendRequest;
