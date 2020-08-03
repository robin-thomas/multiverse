import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { MDBBtn, MDBIcon } from 'mdbreact';
import { Container, Row, Col } from 'react-bootstrap';
import ReactFullpage from '@fullpage/react-fullpage';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import queryString from 'query-string';

import Circle from './Circle';
import { HomeHeader } from './Header';
import EmptyRow from '../../utils/EmptyRow';

import FriendshipImage from '../../../assets/how_friend_request.jpg';
import PostImage from '../../../assets/post.png';

import styles from './Home.module.css';

const Home = () => (
  <div className="section">
    <Row>
      <Col md={{ span: 5, offset: 2 }} className={styles['home-first-text']}>
        Decentralized <br />
        Social Network.
      </Col>
      <Divider light orientation="vertical" flexItem />
      <Col className={styles['home-desc']}>
        <Row className={styles['home-desc-row']}>
          <Col>
            <Button variant="contained">No central authority</Button>
          </Col>
        </Row>
        <Row className={styles['home-desc-row']}>
          <Col>
            <Button variant="contained">You own your data</Button>
          </Col>
        </Row>
        <Row className={styles['home-desc-row']}>
          <Col>
            <Button variant="contained">
              Powered by blockchain technologies
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
);

const Which = () => (
  <div className="section">
    <div className={styles['section-which']}>
      <Row>
        <Col md="3">
          <Circle>
            <MDBIcon icon="file-alt" size="2x" />
          </Circle>
          <p>Text</p>
        </Col>
        <Col md="3">
          <Circle>
            <MDBIcon icon="camera" size="2x" />
          </Circle>
          <p>Photo</p>
        </Col>
        <Col md="3">
          <Circle>
            <MDBIcon icon="link" size="2x" />
          </Circle>
          <p>Link</p>
        </Col>
        <Col md="3">
          <Circle>
            <MDBIcon icon="comments" size="2x" />
          </Circle>
          <p>Chat</p>
        </Col>
      </Row>
      <EmptyRow />
      <h1>Seriously, put anything you want here.</h1>
      <p>
        Four items to get you started. This thing is yours. Use it however you
        like.
      </p>
    </div>
  </div>
);

const Post = () => (
  <div className="section">
    <Container>
      <Row>
        <Col md="10" className="mx-auto">
          <img src={PostImage} width="90%" />
        </Col>
      </Row>
    </Container>
  </div>
);

const FriendshipRequest = () => (
  <div className="section">
    <Container>
      <Row>
        <Col md="10" className="mx-auto">
          <img src={FriendshipImage} width="90%" />
        </Col>
        <Col md="2" className="align-self-center">
          <Row>
            <Col className={styles['home-first-text']}>
              How friendship request works
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  </div>
);

const Finish = () => (
  <div className="section">
    <div className={styles['section-finish']}>
      <h1>Okay, so it's not that hard to explain.</h1>
      <p>Now that you understand this thing, hop on!</p>
      <Link to="/login">
        <MDBBtn color="elegant">Get Started</MDBBtn>
      </Link>
    </div>
  </div>
);

const Page = ({ history, location }) => {
  const [button, setButton] = useState('primary');

  const query = queryString.parse(location.search);
  if (query.profile) {
    history.push(`/profile/${query.profile}`);
  }

  const onLeave = (_, destination) => {
    switch (destination.index) {
      case 0:
        setButton('primary');
        break;

      default:
        setButton('');
        break;
    }
  };

  return (
    <>
      <HomeHeader button={button} />
      <ReactFullpage
        navigation
        sectionsColor={['#191A1E', '#0798ec', '#8e24aa', '#191A1E', '#0798ec']}
        onLeave={onLeave}
        render={() => (
          <>
            <Home />
            <Post />
            <Which />
            <FriendshipRequest />
            <Finish />
          </>
        )}
      />
    </>
  );
};

export default withRouter(Page);
