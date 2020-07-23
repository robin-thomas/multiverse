import React, { useContext, useState, useEffect } from 'react';

import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import Box from '../../../utils/3box';
import Timer from '../../utils/Timer';
import File from '../../../utils/file';
import { DataContext } from '../../utils/DataProvider';

import { textile } from '../../../../config.json';

import styles from './ProfileContent.module.css';

const ProfileContent = ({ username, profilePic, post }) => {
  return (
    <Card className={styles['card']} variant="outlined">
      <CardContent className={styles['card-content']}>
        <Row>
          <Col md="auto" className="pr-0 align-self-center">
            <Avatar alt={username} src={profilePic} />
          </Col>
          <Col>
            <Row>
              <Col>{username}</Col>
            </Row>
            <Row>
              <Col>
                <Typography variant="caption">
                  <Timer time={post.timestamp / 1000} />
                  &nbsp;.&nbsp;
                  {post.visibility === 0
                    ? 'Private'
                    : post.visibility === 1
                    ? 'Friends'
                    : 'Public'}
                </Typography>
              </Col>
            </Row>
          </Col>
        </Row>
      </CardContent>
    </Card>
  );
};

const ProfileContents = () => {
  const ctx = useContext(DataContext);

  const [posts, setPosts] = useState([]);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (ctx.profile.profilePic) {
      File.loadImageByName(
        textile.buckets.profile.bucket,
        ctx.profile.profilePic
      )
        .then(setProfilePic)
        .catch(console.error);
    }

    if (
      _.has(ctx.profile, 'posts') &&
      Object.keys(ctx.profile.posts).length > 0
    ) {
      let _posts = [];

      for (const postId of Object.keys(ctx.profile.posts)) {
        const _post = ctx.profile.posts[postId];

        // not logged in, and not public.
        if (!ctx.address && _post.visibility !== 2) {
          continue;
        }

        // logged in, not friend, and post is for friends only.
        const isFriend = _.has(
          ctx.profilePrivate,
          `keys.encryptionKeys.${ctx.profile.address}`
        );
        if (ctx.address !== ctx.profile.address) {
          if (_post.visibility === 0 || (_post.visibility === 1 && !isFriend)) {
            continue;
          }
        }

        let encryptionKey = _post.key;
        if (_post.visibility < 2) {
          encryptionKey = Box.crypto.symmetric.decrypt(
            ctx.profilePrivate.keys.encryptionKeys[ctx.profile.address],
            encryptionKey
          );
        }

        _post.post = Box.crypto.symmetric.decrypt(encryptionKey, _post.post);
        _posts.push(_post);
      }

      _posts.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

      setPosts(_posts);
    }
  }, [ctx.profile]);

  return posts.map((post, index) => (
    <ProfileContent
      key={index}
      profilePic={profilePic}
      username={ctx.profile.username}
      post={post}
    />
  ));
};

export default ProfileContents;
