import React, { useEffect, useContext } from 'react';

import { MDBIcon } from 'mdbreact';
import { Row, Col } from 'react-bootstrap';

import Box from '../utils/3box';
import { DataContext } from './utils/DataProvider';

const Icon = ({ icon, theme, setTheme, style }) => {
  const onClick = (theme) => {
    document.body.setAttribute('data-theme', theme);
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

  useEffect(() => {
    const fn = async () => {
      const boxTheme = await Box.get([Box.DATASTORE_KEY_THEME], {
        address: ctx.address,
      });
      if (boxTheme) {
        ctx.setTheme(boxTheme);
      }
    };

    if (ctx.address) {
      fn();
    }
  }, [ctx.address]);

  return (
    <Row>
      <Col>
        {ctx.theme === 'light' ? (
          <Icon
            style={{ color: '#6c757d' }}
            icon="moon"
            theme="dark"
            setTheme={ctx.setTheme}
          />
        ) : (
          <Icon
            style={{ color: 'rgb(255, 193, 7)' }}
            icon="sun"
            theme="light"
            setTheme={ctx.setTheme}
          />
        )}
      </Col>
    </Row>
  );
};

export default Theme;
