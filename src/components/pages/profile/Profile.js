import React from 'react';
import { withRouter } from 'react-router';
import { useParams } from 'react-router-dom';

import { Row, Col } from 'react-bootstrap';

import Content from '../../app/Content';
import ProfileBox from './ProfileBox';
import EmptyRow from '../../utils/EmptyRow';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import { app } from '../../../../config.json';

const Profile = ({ history }) => {
  const { address } = useParams();

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
