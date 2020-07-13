import { openBox, getSpace } from '3box';
import CryptoJS from 'crypto-js';

import { app } from '../../config.json';

const Box = {
  space: null,
  threadRequest: null,
  threadResponse: null,

  DATASTORE_STATE_PRIVATE: 'private',
  DATASTORE_STATE_FRIENDS: 'friends',
  DATASTORE_STATE_PUBLIC: 'public',

  DATASTORE_KEY_THEME: `${app.name}-theme`,
  DATASTORE_KEY_COUNTRY: `${app.name}-country`,
  DATASTORE_KEY_PROFILE: `${app.name}-profile`,
  DATASTORE_KEY_USERNAME: `${app.name}-username`,
  DATASTORE_KEY_PROFILE_PIC: `${app.name}-profilePic`,
  DATASTORE_KEY_PROFILE_BACKGROUND: `${app.name}-profileBackground`,
  DATASTORE_KEY_ENCRYPTION_KEY: `${app.name}-encryptionKey`,

  DATASTORE_PENDING_SENT_REQUESTS: `${app.name}-pendingSentRequests`,

  /**
   * create a new 3Box space client
   *
   * @returns {Object} authenticated 3Box space client
   */
  getClient: async (address) => {
    if (Box.space === null) {
      const box = await openBox(address, window.ethereum);
      await box.syncDone;

      Box.space = await box.openSpace(app.name);
      Box.threadRequest = await Box.space.joinThread(
        `${app.name}-threadRequest`
      );
      Box.threadResponse = await Box.space.joinThread(
        `${app.name}-threadResponse`
      );
      console.log('threadRequest', Box.threadRequest);
      console.log('threadResponse', Box.threadResponse);
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
      opts.stateChange = opts.stateChange || false;
      opts.state =
        opts.state === undefined ? Box.DATASTORE_STATE_PRIVATE : opts.state;

      const client = await Box.getClient(opts.address);

      if (opts.state === Box.DATASTORE_STATE_PRIVATE) {
        if (opts.stateChange) {
          client.public.remove(key);
        }
        await client.private.set(key, value);
      } else {
        if (opts.state === Box.DATASTORE_STATE_FRIENDS) {
          value = CryptoJS.AES.encrypt(value, opts.encryptionKey).toString();
        }

        if (opts.stateChange) {
          client.private.remove(key);
        }
        await client.public.set(
          key,
          JSON.stringify({ value, state: opts.state })
        );
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
  get: async (keys, opts = {}) => {
    try {
      opts.state = opts.state !== undefined ? opts.state : {};
      opts.state = keys.reduce((p, c) => {
        if (!p[c]) {
          p[c] = Box.DATASTORE_STATE_PRIVATE;
        }

        return p;
      }, opts.state);

      // Filter out the private key data.
      const privateKeys = [];
      const publicKeys = [];
      for (const key of keys) {
        if (opts.state[key] === Box.DATASTORE_STATE_PRIVATE) {
          privateKeys.push(key);
        } else {
          publicKeys.push(key);
        }
      }

      let spaceData = {};
      if (privateKeys.length > 0) {
        const client = await Box.getClient(opts.address);
        const data = await client.private.all();
        spaceData = { ...spaceData, ...data };
      }
      if (publicKeys.length > 0) {
        const data = await Box.getSpace(opts.address, app.name);
        spaceData = { ...spaceData, ...data };
      }

      const response = Object.keys(spaceData)
        .filter((e) => keys.includes(e))
        .reduce((p, c) => {
          let val;
          if (opts.state[c] === Box.DATASTORE_STATE_FRIENDS) {
            val = CryptoJS.AES.decrypt(
              spaceData[c],
              opts.encryptionKey
            ).toString(CryptoJS.enc.Utf8);
          } else {
            val = spaceData[c];
          }

          try {
            val = JSON.parse(val);
          } catch (err) {}

          p[c] = val;

          return p;
        }, {});

      if (Object.keys(response).length === 1) {
        return response[keys[0]];
      }

      return response;
    } catch (err) {
      throw err;
    }
  },

  getAllPublic: async (opts = {}) => {
    opts.encryptionKey = opts.encryptionKey || null;

    const data = await getSpace(opts.address, app.name);

    return Object.keys(data).reduce((p, c) => {
      const result = JSON.parse(data[c]);

      if (result.state === Box.DATASTORE_STATE_FRIENDS) {
        if (opts.encryptionKey) {
          p[c] = CryptoJS.AES.decrypt(
            result.value,
            opts.encryptionKey
          ).toString(CryptoJS.enc.Utf8);
        }
      } else {
        p[c] = result.value;
      }

      return p;
    }, {});
  },

  append: async (key, value, opts = {}) => {
    try {
      const client = await Box.getClient(opts.address);

      let data = JSON.parse(await client.private.get(key));

      if (value.key) {
        data[key] = value.value;
      } else {
        data.push(value);
      }

      await client.private.set(key, JSON.stringify(data));
    } catch (err) {
      throw err;
    }
  },

  message: {
    request: {
      getAll: async (address) => {
        try {
          const client = await Box.getClient(address);
          const [requests, responses] = await Promise.all([
            Box.threadRequest.getPosts(),
            Box.threadResponse.getPosts(),
          ]);

          const pendingRequests = requests
            .map((e) => JSON.parse(e.message))
            .filter((e) => e.friend === address);
          const completed = responses
            .map((e) => JSON.parse(e.message))
            .filter((e) => e.address === address)
            .map((e) => e.friend);

          return pendingRequests.filter((e) => !completed.includes(e.address));
        } catch (err) {
          throw err;
        }
      },

      post: async (data, opts = {}) => {
        try {
          const client = await Box.getClient(opts.address);
          await Box.threadRequest.post(JSON.stringify(data));
        } catch (err) {
          throw err;
        }
      },
    },
  },
};

export default Box;
