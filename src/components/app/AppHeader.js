import React, { useContext, useState } from 'react';

import { Card, Row, Col } from 'react-bootstrap';
import { MDBIcon } from 'mdbreact';

import Theme from '../Theme';
import EmptyRow from '../utils/EmptyRow';
import { DataContext } from '../utils/DataProvider';

import styles from './AppHeader.module.css';

const AppCard = ({ active, buttonText, onClick, cls }) => (
  <Card className={styles['app-card']}>
    <Card.Header onClick={onClick}>{buttonText}</Card.Header>
  </Card>
);

const AppCardHeader = ({ active, icon, text }) => (
  <Row>
    <Col className="text-center">
      <MDBIcon
        className={`${active ? 'active-icon' : ''}`}
        size="sm"
        icon={icon}
        title={text}
      />
    </Col>
  </Row>
);

const AppHeaderToggle = ({ display, setDisplay, fake }) => (
  <div className={styles[`app-header-bars${fake ? '-fake' : ''}`]}>
    <div className={styles['app-header-title']}>
      <MDBIcon icon="bars" size="lg" onClick={() => setDisplay(!display)} />
    </div>
  </div>
);

const AppHeader = ({ display, setDisplay }) => {
  const ctx = useContext(DataContext);

  const items = [{ key: 'home', icon: 'home', text: 'Home' }];

  return (
    <div className={styles['app-header']}>
      <AppHeaderToggle display={display} setDisplay={setDisplay} />
      <EmptyRow />
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

const Header = () => {
  const [display, setDisplay] = useState(false);

  if (display) {
    return <AppHeader display={display} setDisplay={setDisplay} />;
  } else {
    return (
      <AppHeaderToggle display={display} setDisplay={setDisplay} fake={true} />
    );
  }
};

export default Header;
