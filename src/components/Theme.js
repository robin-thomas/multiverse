import React, { useState, useEffect, useContext } from 'react';

import { MDBIcon } from 'mdbreact';
import { Row, Col } from 'react-bootstrap';

import Box from '../utils/3box';
import { DataContext } from './utils/DataProvider';

const Icon = ({ icon, theme, setTheme, style, loggedIn }) => {
  const onClick = (theme) => {
    document.body.setAttribute('data-theme', theme);
    if (loggedIn) {
      Box.set(Box.DATASTORE_THEME, theme);
    }
    setTheme(theme);
  };

  return (
    <MDBIcon
      size="sm"
      style={style}
      icon={icon}
      title={`Use ${theme} mode`}
      onClick={() => onClick(theme)}
    />
  );
};

const Theme = (props) => {
  const ctx = useContext(DataContext);

  const [theme, setTheme] = useState(0);

  useEffect(() => {
    const fn = async () => {
      const boxTheme = await Box.get(Box.DATASTORE_THEME, null, true);
      if (boxTheme) {
        setTheme(boxTheme);
      }
    };

    fn();
  }, []);

  return (
    <Row>
      <Col>
        {theme === 'light' ? (
          <Icon
            style={{ color: '#6c757d' }}
            icon="moon"
            theme="dark"
            setTheme={setTheme}
            loggedIn={ctx.loggedIn}
          />
        ) : (
          <Icon
            style={{ color: 'rgb(255, 193, 7)' }}
            icon="sun"
            theme="light"
            setTheme={setTheme}
            loggedIn={ctx.loggedIn}
          />
        )}
      </Col>
    </Row>
  );
};

export default Theme;
