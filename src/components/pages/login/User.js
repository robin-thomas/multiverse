import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router';

import { makeStyles } from '@material-ui/core/styles';
import { Row, Col } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import TextField from '@material-ui/core/TextField';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { green } from '@material-ui/core/colors';

import Box from '../../../utils/3box/index.js';
import Content from '../../app/Content';
import EmptyRow from '../../utils/EmptyRow';
import { DataContext } from '../../utils/DataProvider';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
  },
  cardContent: {
    paddingTop: 0,
  },
  cardHeader: {
    paddingBottom: 0,
  },
  rounded: {
    color: '#fff',
    backgroundColor: green[500],
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const User = ({ history }) => {
  const ctx = useContext(DataContext);

  const classes = useStyles();

  const [error, setError] = useState(false);
  const [name, setName] = useState('');

  const onChange = (name) => {
    if (/^[a-z0-9]+$/.test(name)) {
      setError(false);
    } else {
      setError(true);
    }

    setName(name);
  };

  const register = async () => {
    Box.set(Box.DATASTORE_KEY_PROFILE_PUBLIC, {
      username: name,
    });

    history.push(`/profile/${ctx.address}`);
  };

  return (
    <Content>
      <Row style={{ height: '100vh' }}>
        <Col md="auto" className="mx-auto align-self-center">
          <Card className={classes.root} variant="outlined">
            <CardHeader
              className={classes.cardHeader}
              avatar={
                <Avatar variant="rounded" className={classes.rounded}>
                  <AssignmentIcon />
                </Avatar>
              }
              title="Pick a username"
              titleTypographyProps={{
                variant: 'overline',
              }}
            />
            <CardContent className={classes.cardContent}>
              <hr />
              <EmptyRow />
              <Row>
                <Col>
                  {error ? (
                    <TextField
                      required
                      value={name}
                      onChange={(e) => onChange(e.target.value)}
                      label="Username"
                      helperText="Only [a-z0-9] characters"
                      variant="outlined"
                      error
                    />
                  ) : (
                    <TextField
                      required
                      value={name}
                      onChange={(e) => onChange(e.target.value)}
                      label="Username"
                      helperText="Yup! That's all for now"
                      variant="outlined"
                    />
                  )}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md="auto">
                  {error ? (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PersonIcon />}
                      disabled
                    >
                      Register
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PersonIcon />}
                      onClick={register}
                    >
                      Register
                    </Button>
                  )}
                </Col>
              </Row>
            </CardContent>
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default withRouter(User);
