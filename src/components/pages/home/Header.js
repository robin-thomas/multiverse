import React, { useContext } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import { Container, Row, Col } from 'react-bootstrap';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

import Search from '../profile/search';
import FriendRequests from '../profile/FriendRequests';
import Notifications from '../profile/Notifications';
import { DataContext } from '../../utils/DataProvider';

import { app } from '../../../../config.json';

import styles from './Header.module.css';

const Header = ({ history, setBackdropOpen }) => {
  const ctx = useContext(DataContext);

  const logout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      ctx.setProfile({});
      ctx.setAddress(null);
      ctx.setProvider(null);
      ctx.setEditable(false);
      ctx.setEncryptionKey(null);
      ctx.setFriendRequests([]);

      history.push('/');
    }
  };

  return (
    <div className={styles['header']}>
      <Row>
        <Col md={{ span: 2, offset: 1 }} className={styles['home-logo']}>
          {app.name}
        </Col>
        {!ctx.address ? (
          <>
            <Col md="5" className="ml-auto align-self-center">
              <Search />
            </Col>
            <Col md="auto" className="ml-auto align-self-center">
              <Notifications setBackdropOpen={setBackdropOpen} />
            </Col>
            <Col md="auto" className="pl-0 align-self-center">
              <FriendRequests setBackdropOpen={setBackdropOpen} />
            </Col>
            <Col md="auto" className="pl-0 align-self-center">
              <Tooltip title="Logout">
                <IconButton color="primary" onClick={logout}>
                  <PowerSettingsNewIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </Col>
          </>
        ) : null}
        <Col md="1">&nbsp;</Col>
      </Row>
    </div>
  );
};

const HomeHeader = ({ button }) => (
  <Container fluid={true} className={styles['home']}>
    <Row>
      <Col md={{ span: 2, offset: 1 }} className={styles['home-logo']}>
        {app.name}
      </Col>
      <Col md="auto" className="ml-auto align-self-center">
        <Link to="/login">
          <Button variant="contained" color={button}>
            Try it out
          </Button>
        </Link>
      </Col>
    </Row>
  </Container>
);

export { HomeHeader };
export default withRouter(Header);
