import React, { useEffect, useContext } from 'react';
import { withRouter } from 'react-router';
import { useParams } from 'react-router-dom';

import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Posts from './posts';
import Box from '../../../utils/3box';
import File from '../../../utils/file';
import Image from '../../../utils/image';
import Bucket from '../../../utils/bucket';
import Content from '../../app/Content';
import ProfileBox from './about/ProfileBox';
import EmptyRow from '../../utils/EmptyRow';
import Chat from '../../utils/chat';
import { DataContext } from '../../utils/DataProvider';

import { app, textile } from '../../../../config.json';

const Profile = ({ history }) => {
  const ctx = useContext(DataContext);

  const { address } = useParams();
  const _url = `${window.location.protocol}//${window.location.host}`;

  useEffect(() => {
    const fn = async () => {
      ctx.setProfilePic(null);
      await Bucket.getClient();

      if (ctx.address !== address) {
        // on backdrop.
        ctx.setBackdropOpen(true);

        const data = await Box.getAllPublic(address);
        console.log('data', data);

        // if no profile found.
        if (!Box.get(Box.DATASTORE_KEY_PROFILE_PUBLIC, 'username', data)) {
          history.push('/profile/404');
        }

        ctx.setProfile({
          ...data[Box.DATASTORE_KEY_PROFILE_PUBLIC].value,
          address,
        });
      } else {
        await Box.getAll(address);
        ctx.setProfile({
          ...Box.storage[Box.DATASTORE_KEY_PROFILE_PUBLIC].value,
          address,
        });
        ctx.setProfilePrivate({
          ...Box.storage[Box.DATASTORE_KEY_PROFILE_PRIVATE].value,
          ...Box.storage[Box.DATASTORE_KEY_PROFILE_PUBLIC].value,
        });
      }

      ctx.setEditable(ctx.address === address);
    };

    fn();
  }, [address]);

  useEffect(() => {
    const fn = async () => {
      try {
        if (_.has(ctx.profile, 'profilePic')) {
          const buck = textile.buckets.profile.bucket;
          const img = await File.loadImageByName(buck, ctx.profile.profilePic);
          ctx.setProfilePic(img);

          // Resize the image for avatar purposes.
          const resizedImg = await Image.resize(img, 50);
          ctx.setProfilePics((_pics) => {
            return {
              ..._pics,
              [ctx.profile.address]: resizedImg,
            };
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fn();
  }, [ctx.profile]);

  useEffect(() => {
    for (const request of ctx.friendRequestsSent) {
      if (request.status === 'ok') {
        const encryptionKey = Box.crypto.asymmetric.decrypt(
          request.encryptedKey,
          request.nonce,
          {
            publicKey: request.pubKey,
            secretKey: Box.get(
              Box.DATASTORE_KEY_PROFILE_PRIVATE,
              'keys.keypair.secretKey'
            ),
          }
        );

        Box.set(Box.DATASTORE_KEY_PROFILE_PRIVATE, {
          keys: {
            encryptionKeys: {
              [request.friend]: encryptionKey,
            },
          },
        });
      }
    }
  }, [ctx.friendRequestsSent]);

  useEffect(() => {
    if (Box.message && Box.message.setRequestCallback) {
      Box.message.setRequestCallback(ctx.setFriendRequests);
    }

    if (Box.message && Box.message.setResponseCallback) {
      Box.message.setResponseCallback(ctx.setFriendRequestsSent);
    }
  }, [ctx.setFriendRequests, ctx.setFriendRequestsSent]);

  const isValidProfile = () => {
    return _.has(ctx.profile, 'address');
  };

  const redirect = () => {
    history.push('/new/post');
  };

  return (
    <Content>
      <EmptyRow rows={2} />
      <Row style={{ height: '100vh' }}>
        <Col md={{ span: 3, offset: 1 }}>
          {app.features.profileBox && isValidProfile() ? (
            <ProfileBox
              url={`${_url}?profile=${address}`}
              offBackdrop={() => ctx.setBackdropOpen(false)}
            />
          ) : null}
        </Col>
        <Col md="7" className="mr-auto">
          {ctx.address ? (
            <Row>
              <Col md="auto" className="ml-auto">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CloudUploadIcon />}
                  onClick={redirect}
                >
                  Create New Post
                </Button>
              </Col>
            </Row>
          ) : null}
          <Row>
            <Col md={{ span: 10, offset: 2 }}>
              <Posts />
            </Col>
          </Row>
        </Col>
      </Row>
      {app.features.chat && ctx.address ? <Chat /> : null}
    </Content>
  );
};

export default withRouter(Profile);
