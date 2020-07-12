import React from 'react';

import { Container } from 'react-bootstrap';

import { PageHeader } from '../pages/home/Header';

import styles from './Content.module.css';

const Content = ({ children }) => (
  <>
    <PageHeader />
    <Container
      fluid={true}
      className={styles['container']}
      style={{ height: '100vh', background: '#191A1E', padding: '0' }}
    >
      {children}
    </Container>
  </>
);

export default Content;
