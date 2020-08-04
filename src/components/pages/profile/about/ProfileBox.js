import React, { useState, useContext, useEffect } from 'react';

import { Row, Col } from 'react-bootstrap';

import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';

import Name from './Name';
import Friends from './Friends';
import FriendRequest from './FriendRequest';
import ShareButton from './ShareButton';
import Box from '../../../../utils/3box';
import TextInput from '../../../utils/TextInput';
import Image from '../../../../utils/image';
import Upload from '../../../utils/upload';
import { DataContext } from '../../../utils/DataProvider';
import EmptyRow from '../../../utils/EmptyRow';

import styles from './ProfileBox.module.css';

const ProfileBox = ({ url, offBackdrop }) => {
  const ctx = useContext(DataContext);

  const [about, setAbout] = useState(null);
  const [imageRows, setImageRows] = useState([]);
  const [show, setShow] = useState(false);
  const [imageHashes, setImageHashes] = useState(null);

  const [postCount, setPostCount] = useState('');
  const [friendCount, setFriendCount] = useState('');

  // -1 => loading (disabled)
  //  0 => show
  //  1 => pending (disabled)
  //  2 => approved (disabled)
  //  3 => blocked (disabled)
  //  4 => self or not logged in (dont show)
  const [pending, setPending] = useState(-1);

  useEffect(() => {
    setAbout(ctx.profile.about ? ctx.profile.about : '');
    offBackdrop();
  }, [ctx.profile.about, offBackdrop]);

  useEffect(() => {
    if (ctx.profile.posts) {
      const _postCount = Object.values(ctx.profile.posts).filter(
        (e) => e !== null
      ).length;
      setPostCount(_postCount);
    } else {
      setPostCount(0);
    }
  }, [ctx.profile.posts]);

  useEffect(() => {
    if (ctx.profile.friends) {
      const _friendCount = Object.values(ctx.profile.friends).filter(
        (e) => e !== null
      ).length;
      setFriendCount(_friendCount);
    } else {
      setFriendCount(0);
    }
  }, [ctx.profile.friends]);

  useEffect(() => {
    if (imageHashes) {
      // Store it in 3box public profile.
      Box.set(Box.DATASTORE_KEY_PROFILE_PUBLIC, {
        profilePic: imageHashes,
      });
    }
  }, [imageHashes]);

  const updateAbout = () => {
    Box.set(Box.DATASTORE_KEY_PROFILE_PUBLIC, { about });
  };

  const onShow = () => {
    setShow(true);
  };

  const toggle = () => {
    setShow((_show) => !_show);
  };

  const addFileNames = (_imageHashes) => {
    setImageHashes(_imageHashes);
  };

  const addImageUrl = (_imageUrl) => {
    ctx.setProfilePic(_imageUrl);

    Image.resize(_imageUrl, 50).then((resizedImg) => {
      ctx.setProfilePics((_pics) => {
        return {
          ..._pics,
          [ctx.address]: resizedImg,
        };
      });
    });
  };

  const getTitle = (_pending) => {
    switch (_pending) {
      case 1:
        return 'Pending Friend';

      case 2:
        return 'Friend';

      case 3:
        return 'Blocked';
    }
  };

  return (
    <Card className={styles['card']} variant="outlined">
      <Upload
        resize={512}
        show={show}
        toggle={toggle}
        imageRows={imageRows}
        setImageRows={setImageRows}
        addFileNames={addFileNames}
        addImageUrl={addImageUrl}
        bucketKey={ctx.bucketKeys.profilePic}
      />
      <CardContent className={styles['card-content']}>
        <Row noGutters={true}>
          <Col md="auto">
            <Row>
              <Col>
                <Avatar
                  alt={ctx.profile.username}
                  src={ctx.profilePics[ctx.profile.address]}
                  className={styles['avatar']}
                />
              </Col>
            </Row>
            {pending >= 1 && pending <= 3 ? (
              <Row style={{ marginTop: '5px' }}>
                <Col className="text-center">
                  <Chip
                    avatar={<FaceIcon />}
                    label={getTitle(pending)}
                    color="primary"
                  />
                </Col>
              </Row>
            ) : null}
          </Col>
          <Col>
            <Row noGutters={true}>
              <Col md="auto" className="ml-auto">
                <Tooltip title="Change profile picture">
                  <IconButton color="primary" component="span" onClick={onShow}>
                    <PhotoCamera />
                  </IconButton>
                </Tooltip>
              </Col>
              <Col md="auto">
                <FriendRequest pending={pending} setPending={setPending} />
              </Col>
              <Col md="auto">
                <ShareButton url={url} />
              </Col>
            </Row>
            <EmptyRow />
            <Row noGutters={true}>
              <Col md="11" className="ml-auto">
                <Name />
              </Col>
            </Row>
          </Col>
        </Row>
        <EmptyRow />
        <Row>
          <Col>
            <Typography variant="caption">
              <TextInput
                type="textarea"
                value={about}
                hint="<Write that killer bio about yourself>"
                onChange={setAbout}
                updateText={updateAbout}
              />
            </Typography>
          </Col>
        </Row>
        <EmptyRow />
        <Row>
          <Col className="text-center">
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="h2">
                  {postCount}
                </Typography>
                <Typography color="textSecondary">
                  {postCount === 1 ? 'Post' : 'Posts'}
                </Typography>
              </CardContent>
            </Card>
          </Col>
          <Col className="text-center">
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="h2">
                  {friendCount}
                </Typography>
                <Typography color="textSecondary">
                  {friendCount === 1 ? 'Friend' : 'Friends'}
                </Typography>
              </CardContent>
            </Card>
          </Col>
        </Row>
        <hr />
        <Friends />
      </CardContent>
    </Card>
  );
};

export default ProfileBox;
