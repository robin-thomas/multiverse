import React, { useEffect, useContext, useState } from 'react';

import { MDBBtn } from 'mdbreact';

import Page from './Page';
import { DataContext } from '../../utils/DataProvider';

import Box from '../../../utils/3box';
import Ethers from '../../../utils/ethers';

const Metamask = ({ setStage }) => {
  const ctx = useContext(DataContext);

  const [toggle, setToggle] = useState(false);
  const [error, setError] = useState('');
  const [errorNext, setErrorNext] = useState(null);

  useEffect(() => {
    const fn = async () => {
      try {
        const provider = await Ethers.getProvider();
        ctx.setProvider(provider);
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
