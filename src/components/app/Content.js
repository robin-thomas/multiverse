import React from 'react';

import { Container } from 'react-bootstrap';

import Header from '../pages/home/Header';

import styles from './Content.module.css';

const Content = ({ children }) => (
  <>
    <Header />
    <Container fluid={true} className={styles['container']}>
      {children}
    </Container>
  </>
);

export default Content;
