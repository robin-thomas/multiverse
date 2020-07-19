import React, { useContext } from 'react';

import { Container } from 'react-bootstrap';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { DataContext } from '../utils/DataProvider';
import Header from '../pages/home/Header';

import styles from './Content.module.css';

const Content = ({ children }) => {
  const ctx = useContext(DataContext);

  return (
    <>
      <Header />
      <Container fluid={true} className={styles['container']}>
        {children}
      </Container>
      <Backdrop className={styles['backdrop']} open={ctx.backdropOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Content;
