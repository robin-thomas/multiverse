import React, { useContext } from 'react';

import getComponent from './Component';
import { DataContext } from '../utils/DataProvider';

import styles from './AppBody.module.css';

const AppBody = (props) => {
  const ctx = useContext(DataContext);

  return <div className={styles['app-body']}>{getComponent(ctx.page)}</div>;
};

export default AppBody;
