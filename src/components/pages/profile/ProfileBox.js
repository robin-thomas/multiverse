import React from 'react';

import { Row, Col } from 'react-bootstrap';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';

import ShareButton from './ShareButton';

import styles from './ProfileBox.module.css';

const ProfileBox = ({ url }) => {
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
              <SettingsIcon fontSize="large" color="info" />
            </IconButton>
          }
          actionPosition="left"
          className={styles['title-bar']}
        />
        <GridListTileBar
          title="@username"
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
              We are going to learn different kinds of species in nature that
              live together to form amazing environment.
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
