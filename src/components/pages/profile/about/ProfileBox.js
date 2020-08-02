import React, { useState, useContext, useEffect } from 'react';

import { Row, Col } from 'react-bootstrap';

import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';

import Name from './Name';
import FriendRequest from './FriendRequest';
import ShareButton from './ShareButton';
import Box from '../../../../utils/3box/index.js';
import TextInput from '../../../utils/TextInput';
import Upload from '../../../utils/upload';
import { DataContext } from '../../../utils/DataProvider';

import styles from './ProfileBox.module.css';

const ProfileBox = ({ url, offBackdrop }) => {
  const ctx = useContext(DataContext);

  const [about, setAbout] = useState(null);
  const [imageRows, setImageRows] = useState([]);
  const [show, setShow] = useState(false);
  const [imageHashes, setImageHashes] = useState(null);

  useEffect(() => {
    setAbout(ctx.profile.about ? ctx.profile.about : '');
    offBackdrop();
  }, [ctx.profile.about, offBackdrop]);

  useEffect(() => {
    if (imageHashes) {
      console.log('imageHashes', imageHashes);

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
  };

  return (
    <Card className={styles['card']} variant="outlined">
      <GridListTile className={styles['tile']}>
        <CardMedia
          className={styles['media']}
          image={
            ctx.profilePic
              ? ctx.profilePic
              : 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
          }
        />
        {ctx.editable ? (
          <GridListTileBar
            titlePosition="top"
            actionIcon={
              <Fab
                size="medium"
                color="primary"
                className={styles['icon']}
                onClick={onShow}
              >
                <EditIcon />
              </Fab>
            }
            actionPosition="left"
            className={styles['title-bar']}
          />
        ) : null}
        <GridListTileBar
          title={<Name />}
          actionIcon={<FriendRequest />}
          className={styles['bottom-title-bar']}
        />
      </GridListTile>
      <Upload
        show={show}
        toggle={toggle}
        imageRows={imageRows}
        setImageRows={setImageRows}
        addFileNames={addFileNames}
        addImageUrl={addImageUrl}
        bucketKey={ctx.bucketKeys.profilePic}
      />
      <CardContent className={styles['card-content']}>
        <Row>
          <Col md="auto" sm="12">
            <Avatar
              alt={ctx.profile.username}
              src={ctx.profilePics[ctx.profile.address]}
            />
          </Col>
          <Col md="7" xs="12">
            <Typography variant="button" display="block" gutterBottom>
              About
            </Typography>
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
          <Col md="auto" xs="12" className="ml-auto">
            <ShareButton url={url} />
          </Col>
        </Row>
      </CardContent>
    </Card>
  );
};

export default ProfileBox;
