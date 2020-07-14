import React, { useEffect, useContext, useState } from 'react';

import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Link from '@material-ui/core/Link';

import Page from './Page';
import { DataContext } from '../../utils/DataProvider';

import Ethers from '../../../utils/ethers';

import styles from './Page.module.css';

const LoginPrompt = () => (
  <Alert severity="info" className={styles['alert']}>
    <AlertTitle>Hello there!</AlertTitle>
    <p>
      This dapp requires access to your wallet. Please{' '}
      <strong>login & authorize</strong> acces to your Metamask wallet to
      continue.
    </p>
    <hr />
    <p>
      Learn more about Metamask{' '}
      <Link href="https://metamask.io/" target="_blank" color="inherit">
        <strong>here</strong>
      </Link>
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
        const address = await Ethers.getAddress(provider);
        ctx.setAddress(address);

        setStage(1);
      } catch (err) {
        switch (err.message) {
          case 'User denied account authorization':
            setError('Uh oh.. you denied Metamask!');
            setErrorNext(
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setError('');
                    setErrorNext(null);
                    setToggle(!toggle);
                  }}
                >
                  Retry
                </Button>
              </>
            );
            break;

          case 'No metamask detected!':
            setError('Uh oh.. you need Metamask!');
            setErrorNext(
              <>
                <Button
                  variant="contained"
                  color="primary"
                  href="https://metamask.io/"
                  target="_blank"
                >
                  Get Metamask
                </Button>
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
