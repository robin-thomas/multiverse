import React, { useEffect, useContext } from 'react';

import Page from './Page';
import { DataContext } from '../../utils/DataProvider';

import Box from '../../../utils/3box';
import Ethers from '../../../utils/ethers';

const Space = ({ setStage }) => {
  const ctx = useContext(DataContext);

  useEffect(() => {
    const fn = async () => {
      // Setup the 3box space.
      try {
        await Box.set(Box.DATASTORE_THEME, ctx.theme, ctx.provider);
        // setStage(2);
      } catch (err) {
        // TODO: metamask rejections doesnt seem to be handled by 3box.

        console.log(err);
      }
    };

    fn();
  }, []);

  return <Page loader={true} text="Setting Up Your Space" />;
};

export default Space;
