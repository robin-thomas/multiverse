import { openBox } from '3box';

import { app } from '../../config.json';

const Box = {
  space: null,

  DATASTORE_PROFILE: 'datastore_profile',

  KEYSTORE_PROFILE: 'keystore_profile',

  /**
   * create a new 3Box space client
   *
   * @returns {Object} authenticated 3Box space client
   */
  getClient: async (web3Provider = null) => {
    if (Box.space === null) {
      const account = (await web3Provider.eth.getAccounts())[0];
      const box = await openBox(account, web3Provider.currentProvider);

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
  set: async (key, value, web3Provider = null) => {
    try {
      const client = await Box.getClient(web3Provider);
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
  get: async (key, web3Provider = null) => {
    try {
      const client = await Box.getClient(web3Provider);
      return await client.private.get(key);
    } catch (err) {
      throw err;
    }
  },
};

export default Box;
