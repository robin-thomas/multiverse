import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import { MDBBtn, MDBIcon } from 'mdbreact';
import { Row, Col, Overlay } from 'react-bootstrap';
import ReactFullpage from '@fullpage/react-fullpage';

import Circle from './Circle';
import Header from './Header';
import EmptyRow from '../../utils/EmptyRow';

import styles from './Home.module.css';
import Icons from '../../assets/doodles.png';

import { app } from '../../../../config.json';

const Home = () => {
  const target = useRef(null);

  return (
    <div className="section">
      <Row ref={target}>
        <Col md="auto" className="mx-auto">
          <img src={Icons} className={styles['section-home-icons']} />
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mx-auto">
          <div className={styles['section-home']}>
            <p>Post whatever you want. Full control. You own your data.</p>
          </div>
        </Col>
      </Row>
      <Overlay target={target.current} show={true} placement="top">
        {(props) => (
          <Row {...props}>
            <Col className="mx-auto" md="auto">
              <span className={styles['logo']}>{app.name}</span>
            </Col>
          </Row>
        )}
      </Overlay>
    </div>
  );
};

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

const Page = () => {
  const [button, setButton] = useState('danger');

  //"#ff5f45"

  return (
    <>
      <Header button={button} />
      <ReactFullpage
        navigation
        sectionsColor={['#282c34', '#8e24aa', '#0798ec']}
        onLeave={(_, destination) => {
          switch (destination.index) {
            case 1:
              setButton('elegant');
              break;

            case 2:
              break;

            case 0:
            default:
              setButton('danger');
          }
        }}
        render={() => (
          <div>
            <Home />
            <Which />
            <Finish />
          </div>
        )}
      />
    </>
  );
};

export default Page;
