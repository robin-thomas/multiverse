import { openBox, getSpace } from '3box';
import CryptoJS from 'crypto-js';
import _ from 'lodash';

import crypto from './crypto';
import message from './message';

import { app, threebox } from '../../../config.json';

const Box = {
  space: null,
  address: null,
  storage: {},
  changes: {},

  state: {
    PRIVATE: 'private',
    FRIENDS: 'friends',
    PUBLIC: 'public',
  },

  keyMap: {},

  DATASTORE_KEY_PROFILE_PUBLIC: `${app.name}-profilePublic`,
  DATASTORE_KEY_PROFILE_PRIVATE: `${app.name}-profilePrivate`,

  DATASTORE_KEY_PENDING_SENT_REQUESTS: `${app.name}-pendingSentRequests`,

  /**
   * create a new 3Box space client
   *
   * @returns {Object} authenticated 3Box space client
   */
  getClient: async (address) => {
    if (Box.space === null) {
      const box = await openBox(address, window.ethereum);
      await box.syncDone;

      Box.address = address;
      Box.space = await box.openSpace(app.name);
      await Box.message.init(Box.space);

      Box.keyMap[Box.DATASTORE_KEY_PROFILE_PUBLIC] = Box.state.PUBLIC;
      Box.keyMap[Box.DATASTORE_KEY_PROFILE_PRIVATE] = Box.state.PRIVATE;
      Box.keyMap[Box.DATASTORE_KEY_PENDING_SENT_REQUESTS] = Box.state.PUBLIC;

      setInterval(Box.flush, threebox.flushInterval);
    }

    return Box.space;
  },

  /**
   * Add/update a new value to the 3Box space
   *
   * @param {Object} key
   * @param {Object} value
   */
  set: (key, value, state, setter = null) => {
    try {
      if (Box.storage[key] && typeof value === 'object' && value !== null) {
        Box.storage[key] = {
          state,
          value: _.merge(Box.storage[key].value, value),
        };
      } else {
        Box.storage[key] = { state, value };
      }

      Box.changes[key] = Box.storage[key];

      if (setter) {
        setter(Box.storage[key].value);
      }
    } catch (err) {
      throw err;
    }
  },

  /*
   * Push the changes in Box.changes to 3Box.
   */
  flush: async () => {
    if (Object.keys(Box.changes).length > 0) {
      // Client is guaranteed to have been initialzied.
      const client = await Box.getClient();

      // Split into private & public.
      const pubKeys = [],
        pubValues = [];
      const privKeys = [],
        privValues = [];

      for (const key of Object.keys(Box.changes)) {
        if (Box.keyMap[key] === Box.state.PUBLIC) {
          pubKeys.push(key);
          pubValues.push(Box.changes[key]);
        } else {
          privKeys.push(key);
          privValues.push(Box.changes[key]);
        }

        delete Box.changes[key];
      }

      await Promise.all([
        client.public.setMultiple(pubKeys, pubValues),
        client.private.setMultiple(privKeys, privValues),
      ]);

      console.log('All changes flushed to 3Box');
    }
  },

  /*
   * To get all accessible data about a profile
   */
  getAllPublic: async (address, encryptionKey = null) => {
    const data = await getSpace(address, app.name);

    return Object.keys(data).reduce((p, c) => {
      const item = data[c];

      if (item.state && item.state === Box.state.FRIENDS) {
        const _data = { state: item.state };

        if (encryptionKey) {
          _data.value = CryptoJS.AES.decrypt(
            item.value,
            encryptionKey
          ).toString(CryptoJS.enc.Utf8);
        } else {
          _data.value = null;
        }

        p[c] = _data.value;
      } else {
        p[c] = item.value;
      }

      return p;
    }, {});
  },

  get: (key, param, storage = null) => {
    try {
      const item = (storage !== null ? storage[key] : Box.storage[key]).value;

      if (_.has(item, param)) {
        return _.get(item, param);
      }

      return null;
    } catch (err) {
      return null;
    }
  },

  /*
   * To get all data of my profile
   */
  getAll: async (address) => {
    const client = await Box.getClient(address);

    const [privateData, publicData] = await Promise.all([
      client.private.all(),
      client.public.all(),
    ]);
    const data = { ...privateData, ...publicData };

    const encryptionKey = Box.get(
      Box.DATASTORE_KEY_PROFILE_PRIVATE,
      `keys.encryptionKeys.${address}`,
      data
    );

    return Object.keys(data).reduce((p, c) => {
      const item = data[c];

      if (item.state && item.state === Box.state.FRIENDS) {
        const _data = { state: item.state };

        if (encryptionKey) {
          _data.value = CryptoJS.AES.decrypt(
            item.value,
            encryptionKey
          ).toString(CryptoJS.enc.Utf8);
        } else {
          _data.value = null;
        }

        p[c] = _data;
      } else {
        p[c] = item;
      }

      // Need to store it in Box.storage also.
      Box.storage[c] = p[c];

      return p;
    }, {});
  },

  message,

  crypto: {
    asymmetric: {
      ...crypto.asymmetric,
      genKeypair: () => crypto.asymmetric.genKeypair(Box.address),
    },
  },
};

export default Box;
