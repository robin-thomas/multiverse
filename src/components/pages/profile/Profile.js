import React from 'react';
import { useParams } from 'react-router-dom';

import { Row, Col } from 'react-bootstrap';

import Content from '../../app/Content';
import ProfileBox from './ProfileBox';

import { app } from '../../../../config.json';

const Profile = () => {
  const { address } = useParams();

  return (
    <Content>
      <Row style={{ height: '100vh' }}>
        <Col md={{ span: 3, offset: 1 }} className="align-self-center">
          <ProfileBox url={`${app.url}/profile/${address}`} />
        </Col>
      </Row>
    </Content>
  );
};

export default Profile;
