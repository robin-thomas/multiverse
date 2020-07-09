import { openBox } from '3box';

import Ethers from './ethers';

import { app } from '../../config.json';

const Box = {
  space: null,

  DATASTORE_PROFILE: `${app.name}-profile`,
  DATASTORE_THEME: `${app.name}-theme`,
  DATASTORE_ENCRYPTION_KEY: `${app.name}-encryptionKey`,

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
  set: async (key, value, opts = {}) => {
    try {
      opts.ethersProvider = opts.ethersProvider || null;
      opts.private = opts.private === undefined ? true : opts.private;

      const client = await Box.getClient(opts.ethersProvider);

      if (opts.private) {
        await client.public.remove(key);
        await client.private.set(key, value);
      } else {
        await client.private.remove(key);
        await client.public.set(key, value);
      }
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
  get: async (key, opts = {}) => {
    try {
      opts.ethersProvider = opts.ethersProvider || null;
      opts.private = opts.private === undefined ? true : opts.private;

      if (opts.private) {
        const client = await Box.getClient(opts.ethersProvider);
        return await client.private.get(key);
      } else {
        const spaceData = await Box.getSpace(opts.address, app.name);
        return spaceData[key];
      }
    } catch (err) {
      throw err;
    }
  },
};

export default Box;
