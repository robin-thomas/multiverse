import React, { useContext, useState, useEffect, useRef } from 'react';

import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';

import Post from './Post';
import Box from '../../../../utils/3box';
import Bucket from '../../../../utils/bucket';
import Crypto from '../../../../utils/crypto';
import { DataContext } from '../../../utils/DataProvider';

import styles from './Posts.module.css';

const Posts = () => {
  const ctx = useContext(DataContext);

  const simpleBar = useRef(null);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(-1);

  useEffect(() => {
    let _posts = [];
    if (ctx.profile.username) {
      setLoading(1);
    }

    if (ctx.profile.posts && Object.keys(ctx.profile.posts).length > 0) {
      for (const postId of Object.keys(ctx.profile.posts)) {
        let _post = { ...ctx.profile.posts[postId] };

        if (_post && _post.post) {
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
            if (
              _post.visibility === 0 ||
              (_post.visibility === 1 && !isFriend)
            ) {
              continue;
            }
          }

          _post.decryptionKey = _post.key;
          if (_post.visibility < 2) {
            const keys = ctx.profilePrivate.keys.encryptionKeys;
            const key = keys[ctx.profile.address];
            _post.decryptionKey = Crypto.symmetric.decrypt(key, _post.key);
          }

          const dPost = Crypto.symmetric.decrypt(
            _post.decryptionKey,
            _post.post
          );
          _post = { ..._post, ...JSON.parse(dPost) };
          delete _post.post;

          console.log('post', _post);

          _posts.push(_post);
        }
      }

      _posts.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
    }

    setPosts(_posts);
  }, [ctx.profile.posts]);

  useEffect(() => {
    if (ctx.profile.username) {
      setLoading(0);
    }
  }, [posts]);

  const onDelete = (postId, visibility) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const arg = {
        posts: {
          [postId]: null,
        },
      };

      if (visibility > 0) {
        Box.set(Box.DATASTORE_KEY_PROFILE_PUBLIC, arg);
      } else {
        Box.set(Box.DATASTORE_KEY_PROFILE_PRIVATE, arg);
      }

      Bucket.removeByName(postId);

      setPosts((_posts) => _posts.filter((e) => e.id !== postId));
    }
  };

  return (
    <>
      {loading === 1 ? (
        <CircularProgress color="inherit" />
      ) : posts.length > 0 ? (
        <SimpleBar ref={simpleBar} className={styles['content']}>
          <Row>
            <Col lg="8" xs="12">
              {posts.map((post, index) => (
                <Post
                  key={index}
                  profilePic={ctx.profilePics[ctx.profile.address]}
                  username={ctx.profile.username}
                  post={post}
                  onDelete={onDelete}
                />
              ))}
            </Col>
          </Row>
        </SimpleBar>
      ) : loading !== -1 ? (
        <Alert severity="info" style={{ width: '395px' }}>
          Oops. This user has not made any posts yet!
        </Alert>
      ) : null}
    </>
  );
};

export default Posts;
