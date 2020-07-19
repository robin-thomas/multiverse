import React from 'react';

import { Card, ListGroup } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SimpleBar from 'simplebar-react';

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
  return <Tooltip {...props} interactive classes={classes} />;
};

const Alert = ({
  simpleBar,
  arrow,
  title,
  icon,
  children,
  count,
  setCount,
  open,
  setOpen,
}) => {
  const triggerOpen = () => {
    setOpen(!open);
    setCount(0);
  };

  return (
    <>
      <NTooltip
        arrow={arrow ? arrow : true}
        open={open}
        title={
          <Card style={{ width: '350px' }}>
            {title ? (
              <Card.Header className={styles['card-title']}>
                {title}
              </Card.Header>
            ) : null}
            <Card.Body className={styles['card-body']}>
              <SimpleBar ref={simpleBar} className={styles['simplebar']}>
                <ListGroup className="list-group-flush">{children}</ListGroup>
              </SimpleBar>
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
          {title ? (
            <Tooltip title={title}>
              <IconButton color="primary" onClick={triggerOpen}>
                {icon}
              </IconButton>
            </Tooltip>
          ) : (
            <IconButton color="primary" onClick={triggerOpen}>
              {icon}
            </IconButton>
          )}
        </Badge>
      </NTooltip>
    </>
  );
};

export { NTooltip };
export default Alert;
