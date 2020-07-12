import React, { useState, useContext, useEffect } from 'react';

import { Row, Col } from 'react-bootstrap';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';

import Name from './Name';
import ShareButton from './ShareButton';
import Box from '../../../utils/3box';
import TextInput from '../../utils/TextInput';
import { DataContext } from '../../utils/DataProvider';

import styles from './ProfileBox.module.css';

const ProfileBox = ({ url, profile }) => {
  const ctx = useContext(DataContext);

  const [about, setAbout] = useState(null);

  useEffect(() => {
    console.log(profile);
    if (profile[Box.DATASTORE_KEY_ABOUT]) {
      setAbout(profile[Box.DATASTORE_KEY_ABOUT]);
    }
  }, [profile]);

  const updateAbout = async () => {
    await Box.set(Box.DATASTORE_KEY_ABOUT, about, {
      address: ctx.address,
      state: Box.DATASTORE_STATE_PUBLIC,
    });
  };

  return (
    <Card className={styles['card']} variant="outlined">
      <GridListTile class={styles['tile']}>
        <CardMedia
          className={styles['media']}
          image="https://image.freepik.com/free-photo/river-foggy-mountains-landscape_1204-511.jpg"
        />
        <GridListTileBar
          titlePosition="top"
          actionIcon={
            <IconButton className={styles['icon']}>
              <EditIcon fontSize="large" />
            </IconButton>
          }
          actionPosition="left"
          className={styles['title-bar']}
        />
        <GridListTileBar
          title={<Name profile={profile} />}
          actionIcon={
            <Button
              variant="contained"
              color="primary"
              className={styles['icon-bottom']}
            >
              Add as friend
            </Button>
          }
          className={styles['bottom-title-bar']}
        />
      </GridListTile>
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
                editable={profile.editable}
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
