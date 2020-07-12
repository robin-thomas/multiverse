import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router';
import { useParams } from 'react-router-dom';

import { Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Box from '../../../utils/3box';
import Content from '../../app/Content';
import ProfileBox from './about/ProfileBox';
import EmptyRow from '../../utils/EmptyRow';
import { DataContext } from '../../utils/DataProvider';

import { app } from '../../../../config.json';

const Profile = ({ history }) => {
  const ctx = useContext(DataContext);

  const { address } = useParams();

  useEffect(() => {
    ctx.setProfileAddress(address);

    const fn = async () => {
      const data = await Box.getAllPublic({ address });
      ctx.setEditable(ctx.address === address);
      ctx.setProfile(data);
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
          <EmptyRow rows={3} />
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
    </Content>
  );
};

export default withRouter(Profile);
