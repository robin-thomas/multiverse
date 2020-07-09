import React, { useEffect, useContext, useState } from 'react';

import { MDBBtn } from 'mdbreact';
import { Alert } from 'react-bootstrap';

import Page from './Page';
import { DataContext } from '../../utils/DataProvider';

import Ethers from '../../../utils/ethers';

import styles from './Page.module.css';

const LoginPrompt = () => (
  <Alert variant="primary" className={styles['alert']}>
    <Alert.Heading>Hello there!</Alert.Heading>
    <p>
      This dapp requires access to your wallet. Please <b>login & authorize</b>{' '}
      acces to your Metamask wallet to continue.
    </p>
    <hr />
    <p>
      Learn more about Metamask{' '}
      <Alert.Link href="https://metamask.io/">here</Alert.Link>
    </p>
  </Alert>
);

const Metamask = ({ setStage }) => {
  const ctx = useContext(DataContext);

  const [toggle, setToggle] = useState(false);
  const [error, setError] = useState('');
  const [errorNext, setErrorNext] = useState(null);

  useEffect(() => {
    const fn = async () => {
      try {
        setErrorNext(<LoginPrompt />);

        const provider = await Ethers.getProvider();
        ctx.setProvider(provider);

        const address = await Ethers.getAddress(provider);
        ctx.setAddress(address);

        setStage(1);
      } catch (err) {
        switch (err.message) {
          case 'User denied account authorization':
            setError('Uh oh.. you denied Metamask!');
            setErrorNext(
              <>
                <MDBBtn
                  color="primary"
                  onClick={() => {
                    setError('');
                    setErrorNext(null);
                    setToggle(!toggle);
                  }}
                >
                  Retry
                </MDBBtn>
              </>
            );
            break;

          case 'No metamask detected!':
            setError('Uh oh.. you need Metamask!');
            setErrorNext(
              <>
                <MDBBtn
                  color="primary"
                  href="https://metamask.io/"
                  target="_blank"
                >
                  Get Metamask
                </MDBBtn>
              </>
            );
            break;

          default:
            console.log(err);
            setError('Hmm, something weird happened!');
        }
      }
    };

    fn();
  }, [toggle]);

  return (
    <Page
      loader={true}
      text="Logging You In"
      error={error}
      errorNext={errorNext}
    />
  );
};

export default Metamask;
