import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router';
import { useParams } from 'react-router-dom';

import { Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Box from '../../../utils/3box';
import Content from '../../app/Content';
import ProfileBox from './ProfileBox';
import EmptyRow from '../../utils/EmptyRow';
import { DataContext } from '../../utils/DataProvider';

import { app } from '../../../../config.json';

const Profile = ({ history }) => {
  const ctx = useContext(DataContext);

  const { address } = useParams();

  const [profile, setProfile] = useState({});

  useEffect(() => {
    ctx.setProfileAddress(address);

    const fn = async () => {
      const data = await Box.getAllPublic({ address });
      data.editable = ctx.address === address;

      setProfile(data);
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
          <ProfileBox url={`${app.url}/profile/${address}`} profile={profile} />
        </Col>
        <Col md="7" className="mr-auto">
          <EmptyRow rows={3} />
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
        </Col>
      </Row>
    </Content>
  );
};

export default withRouter(Profile);
