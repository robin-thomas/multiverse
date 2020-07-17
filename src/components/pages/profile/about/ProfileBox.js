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
import Bucket from '../../../../utils/bucket';
import Image from '../../../../utils/image';
import { DataContext } from '../../../utils/DataProvider';

import profileImg from '../../../../assets/profile.jpg';
import styles from './ProfileBox.module.css';

import { textile } from '../../../../../config.json';

const ProfileBox = ({ url, offBackdrop }) => {
  const ctx = useContext(DataContext);

  const [image, setImage] = useState(null);
  const [about, setAbout] = useState(null);
  const [imageRows, setImageRows] = useState([]);
  const [show, setShow] = useState(false);
  const [imageHashes, setImageHashes] = useState(null);

  useEffect(() => {
    if (ctx.profile.about) {
      setAbout(ctx.profile.about);
    }

    if (ctx.profile.profilePic) {
      const matches = ctx.profile.profilePic[0].match(
        /(.*)_image\/(.*)_[0-9]+$/
      );
      const type = `image/${matches[2]}`;

      Promise.all(
        ctx.profile.profilePic.map((path) =>
          Bucket.download(textile.buckets.profile.bucket, path)
        )
      ).then((chunks) => {
        const blob = new Blob(chunks, { type });

        const url = URL.createObjectURL(blob);
        Image.resize(url, null)
          .then(setImage)
          .catch(console.error)
          .finally(() => offBackdrop());
      });
    } else {
      setImage(profileImg);
      offBackdrop();
    }
  }, [ctx.profile]);

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

  return (
    <Card className={styles['card']} variant="outlined">
      <GridListTile className={styles['tile']}>
        <CardMedia className={styles['media']} image={image} />
        {ctx.editable ? (
          <GridListTileBar
            titlePosition="top"
            actionIcon={
              <Fab
                size="medium"
                color="primary"
                className={styles['icon']}
                onClick={() => setShow(true)}
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
        toggle={() => setShow(!show)}
        imageRows={imageRows}
        setImageRows={setImageRows}
        addImageHashes={(_imageHashes) => setImageHashes(_imageHashes)}
        addImageUrl={(_imageUrl) => setImage(_imageUrl)}
        bucketKey={ctx.bucketKeys.profilePic}
        filePath={textile.buckets.profile.filePaths.profilePic}
      />
      <CardContent className={styles['card-content']}>
        <Row>
          <Col md="auto">
            <Avatar alt="username" src="/static/images/avatar/1.jpg" />
          </Col>
          <Col md="8">
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
        </Row>
        <hr />
        <Row>
          <Col>
            <ShareButton url={url} />
          </Col>
        </Row>
      </CardContent>
    </Card>
  );
};

export default ProfileBox;
