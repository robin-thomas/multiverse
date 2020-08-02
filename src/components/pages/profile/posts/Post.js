import React, { useState, useEffect, useContext } from 'react';

import _ from 'lodash';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';

import Photos from './Photos';
import PostFooter from './PostFooter';
import Box from '../../../../utils/3box';
import Crypto from '../../../../utils/crypto';
import Timer from '../../../utils/Timer';
import File from '../../../../utils/file';
import Editor from '../../../utils/Editor';
import { DataContext } from '../../../utils/DataProvider';

import styles from './Post.module.css';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    width: '170px',
  },
}))(MenuItem);

const Post = React.memo(({ username, profilePic, post, onDelete }) => {
  const ctx = useContext(DataContext);

  const [images, setImages] = useState([]);
  const [editable, setEditable] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [postContent, setPostContent] = useState(post.content);

  useEffect(() => {
    const fn = async () => {
      if (
        _.has(post, 'attachments.image') &&
        post.attachments.image.length > 0
      ) {
        const _images = [];
        for (const image of post.attachments.image) {
          try {
            const _image = await File.loadImageByName(
              post.id,
              image,
              null,
              post.decryptionKey
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

    if (post.decryptionKey) {
      fn();
    }
  }, [post.decryptionKey]);

  const _edit = () => {
    setEditable(true);
    setAnchorEl(null);
  };

  const _delete = () => {
    onDelete(post.id, post.visibility);
    setAnchorEl(null);
  };

  const updatePostContent = () => {
    // Re-encrypt.
    const _post = JSON.stringify({
      id: post.id,
      bucket: post.bucket,
      content: postContent,
      attachments: post.attachments,
    });
    const encryptedPost = Crypto.symmetric.encrypt(post.decryptionKey, _post);

    // Update it in 3Box.
    const arg = {
      posts: {
        [post.id]: {
          post: encryptedPost,
        },
      },
    };

    if (post.visibility > 0) {
      Box.set(Box.DATASTORE_KEY_PROFILE_PUBLIC, arg);
    } else {
      Box.set(Box.DATASTORE_KEY_PROFILE_PRIVATE, arg);
    }

    setEditable(false);
  };

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
        action={
          ctx.address === ctx.profile.address ? (
            <>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVertIcon />
              </IconButton>
              <StyledMenu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <StyledMenuItem onClick={_edit}>
                  <ListItemIcon className={styles['list-item']}>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Edit" />
                </StyledMenuItem>
                <StyledMenuItem onClick={_delete}>
                  <ListItemIcon className={styles['list-item']}>
                    <DeleteOutlineIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Delete" />
                </StyledMenuItem>
              </StyledMenu>
            </>
          ) : null
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
      <Photos images={images} />
      <CardContent>
        {editable ? (
          <>
            <Editor input={postContent} setInput={setPostContent} />
            <Button
              variant="contained"
              color="primary"
              className={styles['editor-btn']}
              onClick={updatePostContent}
            >
              Save
            </Button>
          </>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: postContent }} />
        )}
        <PostFooter address={post.thread} />
      </CardContent>
    </Card>
  );
});

export default Post;
