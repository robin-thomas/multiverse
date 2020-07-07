import React, { useContext } from 'react';

import getComponent from './Component';
import { DataContext } from '../utils/DataProvider';

import styles from './App.module.css';

const App = () => {
  const ctx = useContext(DataContext);

  return (
    <div className={styles.app}>
      <header className={styles.header}>{getComponent(ctx.page)}</header>
    </div>
  );
};

export default App;
