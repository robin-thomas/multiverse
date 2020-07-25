import React, { useContext, useState, useEffect, useRef } from 'react';

import _ from 'lodash';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import SimpleBar from 'simplebar-react';

import Crypto from '../../../utils/3box/crypto';
import Timer from '../../utils/Timer';
import File from '../../../utils/file';
import { DataContext } from '../../utils/DataProvider';

import styles from './ProfileContent.module.css';

const ProfileContent = React.memo(
  ({ username, profilePic, post, decryptionKey }) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
      const fn = async () => {
        if (
          _.has(post, 'post.attachments.image') &&
          post.post.attachments.image.length > 0
        ) {
          const _images = [];
          for (const image of post.post.attachments.image) {
            try {
              const _image = await File.loadImageByName(
                post.post.id,
                image,
                null,
                decryptionKey
              );
              _images.push(_image);
            } catch (err) {
              console.error(err);
            }
          }

          if (_images.length > 0) {
            setImages(_images);
          }
        }
      };

      if (decryptionKey) {
        fn();
      }
    }, [decryptionKey]);

    return (
      <Card className={styles['card']} variant="outlined">
        <CardHeader
          avatar={
            <Avatar
              alt={username}
              src={profilePic}
              className={styles['avatar']}
            />
          }
          title={username}
          subheader={
            <>
              <Timer time={post.timestamp / 1000} />
              &nbsp;.&nbsp;
              {post.visibility === 0
                ? 'Private'
                : post.visibility === 1
                ? 'Friends'
                : 'Public'}
            </>
          }
        />
        {images.length > 0 ? (
          <CardMedia className={styles['media']} image={images[0]} />
        ) : null}
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            <div dangerouslySetInnerHTML={{ __html: post.post.content }} />
          </Typography>
        </CardContent>
      </Card>
    );
  }
);

const ProfileContents = () => {
  const ctx = useContext(DataContext);

  const simpleBar = useRef(null);

  const [posts, setPosts] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [decryptionKey, setDecryptionKey] = useState(null);

  useEffect(() => {
    // if (ctx.profile.profilePic) {
    //   File.loadImageByName(
    //     textile.buckets.profile.bucket,
    //     ctx.profile.profilePic
    //   )
    //     .then(setProfilePic)
    //     .catch(console.error);
    // }

    if (
      _.has(ctx.profile, 'posts') &&
      Object.keys(ctx.profile.posts).length > 0
    ) {
      let _posts = [];

      for (const postId of Object.keys(ctx.profile.posts)) {
        const _post = { ...ctx.profile.posts[postId] };

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
          encryptionKey = Crypto.symmetric.decrypt(
            ctx.profilePrivate.keys.encryptionKeys[ctx.profile.address],
            encryptionKey
          );
        }

        console.log('post', _post);

        setDecryptionKey(encryptionKey);

        try {
          _post.post = JSON.parse(
            Crypto.symmetric.decrypt(encryptionKey, _post.post)
          );
        } catch (err) {
          // console.error(err);
        }
        _posts.push(_post);
      }

      _posts.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

      setPosts(_posts);
    }
  }, [ctx.profile]);

  return (
    <SimpleBar ref={simpleBar} className={styles['content']}>
      {posts.map((post, index) => (
        <ProfileContent
          key={index}
          profilePic={profilePic}
          username={ctx.profile.username}
          post={post}
          decryptionKey={decryptionKey}
        />
      ))}
    </SimpleBar>
  );
};

export default ProfileContents;
