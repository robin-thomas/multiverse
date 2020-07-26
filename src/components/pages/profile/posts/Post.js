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

import Timer from '../../../utils/Timer';
import File from '../../../../utils/file';
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
  const [anchorEl, setAnchorEl] = useState(null);

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

  const _delete = () => {
    onDelete(post.id, post.visibility);
    setAnchorEl(null);
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
                <StyledMenuItem>
                  <ListItemIcon style={{ minWidth: '35px' }}>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Edit" />
                </StyledMenuItem>
                <StyledMenuItem onClick={_delete}>
                  <ListItemIcon style={{ minWidth: '35px' }}>
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
      {images.length > 0 ? (
        <CardMedia className={styles['media']} image={images[0]} />
      ) : null}
      <CardContent>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </CardContent>
    </Card>
  );
});

export default Post;
