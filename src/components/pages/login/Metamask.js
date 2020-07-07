import React, { useEffect, useContext, useState } from 'react';

import Page from './Page';
import { DataContext } from '../../utils/DataProvider';

import Box from '../../../utils/3box';
import Ethers from '../../../utils/ethers';

const Metamask = () => {
  const ctx = useContext(DataContext);

  const [error, setError] = useState('');

  useEffect(() => {
    const fn = async () => {
      // Setup the 3box space.
      try {
        const provider = await Ethers.getProvider();
        ctx.setProvider(provider);
      } catch (err) {
        switch (err.message) {
          case 'User denied account authorization':
            setError('Uh oh.. you denied Metamask!');
            break;

          default:
            setError('Hmm, something weird happened!');
        }
      }
    };

    fn();
  }, [ctx.loggedIn]);

  return <Page loader={true} text="Logging You In" error={error} />;
};

export default Metamask;
