import React, { useEffect, useContext } from 'react';

import Page from './Page';
import { DataContext } from '../../utils/DataProvider';

import Box from '../../../utils/3box';
import Ethers from '../../../utils/ethers';

const Space = () => {
  const ctx = useContext(DataContext);

  useEffect(() => {
    const fn = async () => {
      // Setup the 3box space.
      try {
        await Box.set(Box.DATASTORE_THEME, ctx.theme, ctx.provider);
      } catch (err) {
        console.log(err);
        // something went wrong. handle it.
      }
    };

    fn();
  }, [ctx.loggedIn]);

  return <Page loader={true} text="Setting Up Your Space" />;
};

export default Space;
