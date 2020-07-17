import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router';
import { useParams } from 'react-router-dom';

import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import Box from '../../../utils/3box/index.js';
import Content from '../../app/Content';
import ProfileBox from './about/ProfileBox';
import EmptyRow from '../../utils/EmptyRow';
import { DataContext } from '../../utils/DataProvider';

import styles from './Profile.module.css';

const Profile = ({ history }) => {
  const ctx = useContext(DataContext);

  const { address } = useParams();
  const _url = `${window.location.protocol}//${window.location.host}`;

  const [backdropOpen, setBackdropOpen] = useState(false);

  useEffect(() => {
    const fn = async () => {
      if (ctx.address !== address) {
        // on backdrop.
        setBackdropOpen(true);

        const data = await Box.getAllPublic(address);
        console.log('data', data);

        // if no profile found.
        if (!Box.get(Box.DATASTORE_KEY_PROFILE_PUBLIC, 'username', data)) {
          history.push('/profile/404');
        }

        ctx.setProfile({
          ...data[Box.DATASTORE_KEY_PROFILE_PUBLIC].value,
          address,
        });
      } else {
        await Box.getAll(address);
        ctx.setProfile({
          ...Box.storage[Box.DATASTORE_KEY_PROFILE_PUBLIC].value,
          address,
        });
        ctx.setProfilePrivate(
          Box.storage[Box.DATASTORE_KEY_PROFILE_PRIVATE].value
        );
      }

      ctx.setEditable(ctx.address === address);
    };

    fn();
  }, [address]);

  const isValidProfile = () => {
    return _.has(ctx.profile, 'address');
  };

  const redirect = () => {
    history.push('/new/post');
  };

  return (
    <Content>
      <Row style={{ height: '100vh' }}>
        <Col md={{ span: 3, offset: 1 }} className="align-self-center">
          {isValidProfile() ? (
            <ProfileBox
              url={`${_url}?profile=${address}`}
              offBackdrop={() => setBackdropOpen(false)}
            />
          ) : null}
        </Col>
        <Col md="7" className="mr-auto">
          <EmptyRow rows={3} />
          {ctx.address ? (
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
