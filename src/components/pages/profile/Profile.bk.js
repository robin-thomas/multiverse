import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Container, Row, Col } from 'react-bootstrap';

import Box from '../../../utils/3box';
import Header from './header';
import About from './About';
import Content from '../../app/Content';
import { DataContext } from '../../utils/DataProvider';

import { app } from '../../../../config.json';

const Profile = () => {
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

  return (
    <Content>
      <Header url={`${app.url}/profile/${address}`} profile={profile} />
      <Container>
        <Row>
          <Col md="4">
            <About profile={profile} />
          </Col>
        </Row>
      </Container>
    </Content>
  );
};

export default Profile;
