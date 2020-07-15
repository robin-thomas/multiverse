import React from 'react';

import { Card, ListGroup } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import styles from './Alert.module.css';

const useStyles = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.white,
  },
  tooltip: {
    backgroundColor: 'transparent',
    maxWidth: 350,
  },
}));

const NTooltip = (props) => {
  const classes = useStyles();
  return <Tooltip {...props} arrow interactive classes={classes} />;
};

const Alert = ({ title, icon, children, count, open, setOpen }) => {
  return (
    <>
      <NTooltip
        open={open}
        title={
          <Card style={{ width: '350px' }}>
            <Card.Header className={styles['card-title']}>{title}</Card.Header>
            <Card.Body className={styles['card-body']}>
              <ListGroup className="list-group-flush">{children}</ListGroup>
            </Card.Body>
          </Card>
        }
        enterDelay={200}
        leaveDelay={200}
        onClose={() => setOpen(false)}
        placement="bottom-end"
        disableFocusListener
      >
        <Badge badgeContent={count} color="secondary">
          <Tooltip title={title}>
            <IconButton color="primary" onClick={() => setOpen(!open)}>
              {icon}
            </IconButton>
          </Tooltip>
        </Badge>
      </NTooltip>
    </>
  );
};

export default Alert;
