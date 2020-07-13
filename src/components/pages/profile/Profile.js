import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router';
import { useParams } from 'react-router-dom';

import { Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import FriendRequests from './FriendRequests';
import Box from '../../../utils/3box';
import Content from '../../app/Content';
import ProfileBox from './about/ProfileBox';
import EmptyRow from '../../utils/EmptyRow';
import { DataContext } from '../../utils/DataProvider';

import { app } from '../../../../config.json';

import styles from './Profile.module.css';

const Profile = ({ history }) => {
  const ctx = useContext(DataContext);

  const { address } = useParams();

  const [backdropOpen, setBackdropOpen] = useState(false);

  useEffect(() => {
    const fn = async () => {
      const data = await Box.getAllPublic({ address });

      // if no profile found.
      if (!data[Box.DATASTORE_KEY_USERNAME]) {
        history.push('/profile/404');
      }

      console.log('profile', { ...data, address });
      ctx.setEditable(ctx.address === address);
      ctx.setProfile({ ...data, address });
    };

    fn();
  }, [address]);

  const redirect = () => {
    history.push('/new/post');
  };

  const logout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      ctx.setProfile({});
      ctx.setAddress(null);
      ctx.setProvider(null);
      ctx.setEditable(false);
      ctx.setEncryptionKey(null);
      ctx.setFriendRequests([]);

      history.push('/');
    }
  };

  return (
    <Content>
      <Row style={{ height: '100vh' }}>
        <Col md={{ span: 3, offset: 1 }} className="align-self-center">
          {ctx.profile && ctx.profile.address ? (
            <ProfileBox url={`${app.url}/profile/${address}`} />
          ) : null}
        </Col>
        <Col md="7" className="mr-auto">
          <EmptyRow rows={2} />
          {ctx.editable ? (
            <Row>
              <Col className="ml-auto" md="auto">
                <FriendRequests setBackdropOpen={setBackdropOpen} />
              </Col>
              <Col md="auto" className="pl-0">
                <Tooltip title="Logout">
                  <IconButton color="primary" onClick={logout}>
                    <PowerSettingsNewIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
              </Col>
            </Row>
          ) : null}
          <EmptyRow rows={1} />
          {ctx.editable ? (
            <Row>
              <Col md="auto" className="ml-auto">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CloudUploadIcon />}
                  onClick={redirect}
                >
                  Create New Post
                </Button>
              </Col>
            </Row>
          ) : null}
        </Col>
      </Row>
      <Backdrop className={styles['backdrop']} open={backdropOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Content>
  );
};

export default withRouter(Profile);
