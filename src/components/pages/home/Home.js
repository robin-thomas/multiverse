import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import { MDBBtn, MDBIcon } from 'mdbreact';
import { Row, Col, Overlay } from 'react-bootstrap';
import ReactFullpage from '@fullpage/react-fullpage';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import Circle from './Circle';
import Header from './Header';
import EmptyRow from '../../utils/EmptyRow';

import styles from './Home.module.css';
import Icons from '../../assets/doodles.png';

import { app } from '../../../../config.json';

const useStyles = makeStyles({
  root: {
    maxWidth: 300,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const HomeCard = ({ title, desc }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Home = () => (
  <div className="section">
    <Row>
      <Col md={{ span: 4, offset: 2 }} className={styles['home-first-text']}>
        Decentralized Social Network.
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
        sectionsColor={['#191A1E', '#8e24aa', '#0798ec']}
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
