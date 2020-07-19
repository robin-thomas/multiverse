import React from 'react';

import { Card, ListGroup } from 'react-bootstrap';

import { NTooltip } from '../Alert';

import styles from '../Alert.module.css';

const Box = ({ open, setOpen, children, icon }) => (
  <NTooltip
    arrow={false}
    open={open}
    title={
      <Card style={{ width: '750px' }}>
        <Card.Body className={styles['card-body']}>
          <ListGroup className="list-group-flush">{children}</ListGroup>
        </Card.Body>
      </Card>
    }
    enterDelay={200}
    leaveDelay={200}
    onClose={() => setOpen(false)}
    placement="bottom-start"
    disableFocusListener
  >
    {icon}
  </NTooltip>
);

export default Box;
