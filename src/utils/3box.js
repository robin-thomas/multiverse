import ThreeBox from '3box';

import Ethers from './ethers';

import { app } from '../../config.json';

const Box = {
  space: null,

  DATASTORE_PROFILE: 'profile',
  DATASTORE_THEME: 'theme',

  /**
   * create a new 3Box space client
   *
   * @returns {Object} authenticated 3Box space client
   */
  getClient: async (ethersProvider, noCreate = false) => {
    if (Box.space === null && !noCreate) {
      const address = await Ethers.getAccount(ethersProvider);

      const box = await ThreeBox.create();
      await box.auth([app.name], {
        address,
        provider: ethersProvider.provider,
      });
      await box.syncDone;

      Box.space = box;
    }

    return Box.space;
  },

  /**
   * Add/update a new value to the 3Box space
   *
   * @param {Object} key
   * @param {Object} value
   */
  set: async (key, value, ethersProvider) => {
    try {
      const client = await Box.getClient(ethersProvider);
      await client.private.set(key, value);
    } catch (err) {
      throw err;
    }
  },

  /**
   * Retrieve value from the 3Box space
   *
   * @param {Object} key
   * @returns {Object} value
   */
  get: async (key, web3Provider, noCreate = false) => {
    try {
      const client = await Box.getClient(web3Provider, noCreate);
      return await client.private.get(key);
    } catch (err) {
      throw err;
    }
  },
};

export default Box;
