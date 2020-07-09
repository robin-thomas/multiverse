import { openBox } from '3box';
import CryptoJS from 'crypto-js';

import Ethers from './ethers';

import { app } from '../../config.json';

const Box = {
  space: null,

  DATASTORE_STATE_PRIVATE: 'private',
  DATASTORE_STATE_FRIENDS: 'friends',
  DATASTORE_STATE_PUBLIC: 'public',

  DATASTORE_KEY_PROFILE: `${app.name}-profile`,
  DATASTORE_KEY_THEME: `${app.name}-theme`,
  DATASTORE_KEY_ENCRYPTION_KEY: `${app.name}-encryptionKey`,

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
      opts.state =
        opts.state === undefined ? Box.DATASTORE_STATE_PRIVATE : opts.state;

      const client = await Box.getClient(opts.ethersProvider);

      if (opts.state === Box.DATASTORE_STATE_PRIVATE) {
        await client.public.remove(key);
        await client.private.set(key, value);
      } else {
        if (opts.state === Box.DATASTORE_STATE_FRIENDS) {
          value = CryptoJS.AES.encrypt(value, opts.encryptionKey).toString();
        }

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
      opts.state =
        opts.state === undefined ? Box.DATASTORE_STATE_PRIVATE : opts.state;

      if (opts.state === Box.DATASTORE_STATE_PRIVATE) {
        const client = await Box.getClient(opts.ethersProvider);
        return await client.private.get(key);
      } else {
        const spaceData = await Box.getSpace(opts.address, app.name);

        let value = spaceData[key];

        if (opts.state === Box.DATASTORE_STATE_FRIENDS) {
          value = CryptoJS.AES.decrypt(value, opts.encryptionKey).toString(
            CryptoJS.enc.Utf8
          );
        }

        return value;
      }
    } catch (err) {
      throw err;
    }
  },
};

export default Box;
