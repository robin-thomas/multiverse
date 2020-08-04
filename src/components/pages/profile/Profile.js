import React, { useEffect, useContext } from 'react';
import { withRouter } from 'react-router';
import { useParams } from 'react-router-dom';

import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';

import Posts from './posts';
import Box from '../../../utils/3box';
import Crypto from '../../../utils/crypto';
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
      ctx.setBackdropOpen(true);
      ctx.setProfilePic(null);

      if (ctx.address !== address) {
        const [, data] = await Promise.all([
          Bucket.getClient(),
          Box.getAllPublic(address),
        ]);
        console.debug(`loaded all public data of ${address}`, data);

        // if no profile found.
        if (!Box.get(Box.DATASTORE_KEY_PROFILE_PUBLIC, 'username', data)) {
          history.push('/profile/404');
        }

        ctx.setProfile({
          ...data[Box.DATASTORE_KEY_PROFILE_PUBLIC].value,
          address,
        });
      } else {
        await Promise.all([Bucket.getClient(), Box.getAll(address)]);

        const privProf = Box.storage[Box.DATASTORE_KEY_PROFILE_PRIVATE].value;
        const profile = Box.storage[Box.DATASTORE_KEY_PROFILE_PUBLIC].value;
        console.debug(`loaded all data of ${address}`, profile, privProf);

        let posts = profile.posts;
        if (privProf.posts) {
          posts = { ...posts, ...privProf.posts };
        }
        if (posts) {
          posts = Object.keys(posts).reduce((p, c) => {
            if (posts[c]) {
              p[c] = posts[c];
            }
            return p;
          }, {});
        }
        console.log('posts', posts);

        ctx.setProfilePrivate({ ...privProf, ...profile });
        ctx.setProfile({ ...profile, posts, address });
      }

      ctx.setEditable(ctx.address === address);
    };

    fn();
  }, [address]);

  useEffect(() => {
    const fn = async () => {
      const buck = textile.buckets.profile;
      const img = await File.loadImageByName(buck, ctx.profile.profilePic);
      ctx.setProfilePic(img);

      // Resize the image for avatar purposes.
      if (!ctx.profilePics[ctx.profile.address]) {
        const resizedImg = await Image.resize(img, 200);
        ctx.setProfilePics((_pics) => {
          return {
            ..._pics,
            [ctx.profile.address]: resizedImg,
          };
        });
      }
    };

    if (ctx.profile.profilePic) {
      fn();
    }
  }, [ctx.profile.profilePic]);

  useEffect(() => {
    for (const request of ctx.friendRequestsSent) {
      if (request.status === 'ok') {
        const encryptionKey = Crypto.asymmetric.decrypt(
          request.encryptedKey,
          request.nonce,
          {
            publicKey: request.pubKey,
            secretKey: Crypto.box.secretKey(),
          }
        );
        console.debug(
          `EncryptionKey of friend ${request.friend.address}`,
          encryptionKey
        );

        Box.set(Box.DATASTORE_KEY_PROFILE_PRIVATE, {
          chats: {
            [request.friend.address]: request.thread,
          },
          keys: {
            encryptionKeys: {
              [request.friend.address]: encryptionKey,
            },
          },
        });

        Box.set(Box.DATASTORE_KEY_PROFILE_PUBLIC, {
          friends: {
            [request.friend.address]: {
              username: request.friend.username,
            },
          },
        });
      }
    }
  }, [ctx.friendRequestsSent]);

  useEffect(() => {
    console.debug('Box.message triggered');
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

  const offBackdrop = () => {
    ctx.setBackdropOpen(false);
  };

  return (
    <Content>
      <EmptyRow rows={2} />
      <Row style={{ height: '100vh' }}>
        <Col
          lg={{ span: 2, offset: 1 }}
          sm={{ span: 4, offset: 1 }}
          className="pr-0"
        >
          {app.features.profileBox && isValidProfile() ? (
            <ProfileBox
              url={`${_url}?profile=${address}`}
              offBackdrop={offBackdrop}
            />
          ) : null}
        </Col>
        <Col>
          <Row noGutters={true}>
            <Col lg={{ span: 10, offset: 2 }} sm={{ span: 11 }}>
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
