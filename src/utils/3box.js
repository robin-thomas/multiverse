import { openBox } from '3box';

import Ethers from './ethers';

import { app } from '../../config.json';

const Box = {
  space: null,

  DATASTORE_PROFILE: `${app.name}-profile`,
  DATASTORE_THEME: `${app.name}-theme`,

  /**
   * create a new 3Box space client
   *
   * @returns {Object} authenticated 3Box space client
   */
  getClient: async (ethersProvider) => {
    if (Box.space === null) {
      const address = await Ethers.getAddress(ethersProvider);

      const box = await openBox(address, window.ethereum);
      await box.syncDone;

      Box.space = await box.openSpace(app.name);
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
  get: async (key, ethersProvider) => {
    try {
      const client = await Box.getClient(ethersProvider);
      return await client.private.get(key);
    } catch (err) {
      throw err;
    }
  },
};

export default Box;
