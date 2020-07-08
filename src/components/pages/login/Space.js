import React, { useEffect, useContext, useState } from 'react';

import { Alert } from 'react-bootstrap';

import Page from './Page';
import { DataContext } from '../../utils/DataProvider';

import Box from '../../../utils/3box';
import Ethers from '../../../utils/ethers';

import styles from './Page.module.css';

const LoginPrompt = () => (
  <Alert variant="primary" className={styles['alert']}>
    <Alert.Heading>#OwnYourData</Alert.Heading>
    <p>
      All your profile information will be stored securely on your{' '}
      <b>3Box account.</b>. Please authorize access to your 3Box account to
      continue. If you don't have a 3Box account, one shall be created for you.
    </p>
    <hr />
    <p>
      Learn more about 3Box{' '}
      <Alert.Link href="https://3box.io/">here</Alert.Link>
    </p>
  </Alert>
);

const Space = () => {
  const ctx = useContext(DataContext);

  const [errorNext, setErrorNext] = useState(<LoginPrompt />);

  useEffect(() => {
    const fn = async () => {
      // Setup the 3box space.
      try {
        await Box.set(Box.DATASTORE_THEME, ctx.theme, ctx.provider);
        ctx.setPage('profile');
      } catch (err) {
        // TODO: metamask rejections doesnt seem to be handled by 3box.

        console.log(err);
      }
    };

    fn();
  }, []);

  return (
    <Page loader={true} text="Setting Up Your Space" errorNext={errorNext} />
  );
};

export default Space;
