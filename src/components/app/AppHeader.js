import React, { useContext, useState, useEffect } from 'react';

import { Card, Row, Col } from 'react-bootstrap';
import { MDBIcon } from 'mdbreact';

import Theme from '../Theme';
import { DataContext } from '../utils/DataProvider';

import styles from './AppHeader.module.css';

import { app } from '../../../config.json';

const AppCard = ({ active, buttonText, onClick, cls }) => (
  <Card className={styles['app-card']}>
    <Card.Header onClick={onClick}>{buttonText}</Card.Header>
  </Card>
);

const AppCardHeader = ({ active, blink, icon, text }) => (
  <Row>
    <Col className="text-center">
      <MDBIcon
        className={`${active ? 'active-icon' : ''} ${
          blink ? styles['app-header-icon-start-chat'] : ''
        }`}
        size="sm"
        icon={icon}
        title={text}
      />
    </Col>
  </Row>
);

const AppHeader = (props) => {
  const ctx = useContext(DataContext);

  const items = [{ key: 'home', icon: 'home', text: 'Home' }];

  return (
    <div className={styles['app-header']}>
      <div className={styles['app-header-title']}>m</div>
      {items.map(({ key, icon, text, action }, index) => (
        <AppCard
          key={index}
          buttonText={
            <AppCardHeader
              active={key === ctx.page}
              icon={icon}
              text={text}
              blink={key === 'create-chat'}
            />
          }
          onClick={() => {
            ctx.setPage(key);

            if (action) {
              action();
            }
          }}
        />
      ))}
      <div className={styles['app-header-theme']}>
        <AppCard buttonText={<Theme />} />
      </div>
    </div>
  );
};

export default AppHeader;
