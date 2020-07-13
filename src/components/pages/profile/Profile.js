import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router';
import { useParams } from 'react-router-dom';

import { Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

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
      console.log('profile', { ...data, address });
      ctx.setEditable(ctx.address === address);
      ctx.setProfile({ ...data, address });
    };

    fn();
  }, [address]);

  const redirect = () => {
    history.push('/new/post');
  };

  return (
    <Content>
      <Row style={{ height: '100vh' }}>
        <Col md={{ span: 3, offset: 1 }} className="align-self-center">
          <ProfileBox url={`${app.url}/profile/${address}`} />
        </Col>
        <Col md="7" className="mr-auto">
          <EmptyRow rows={2} />
          <Row>
            <Col className="ml-auto" md="auto">
              <FriendRequests setBackdropOpen={setBackdropOpen} />
            </Col>
          </Row>
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
