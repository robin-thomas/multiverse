import { Buckets } from '@textile/hub';
import { Libp2pCryptoIdentity } from '@textile/threads-core';

import { textile } from '../../config.json';

const Bucket = {
  client: null,

  getClient: async () => {
    if (Bucket.client === null) {
      console.debug('bucket client init');
      // This is bad practice.
      // Shouldn't be shared in frontend.
      // But for hackathon purposes, sticking it here.
      Bucket.client = await Buckets.withKeyInfo({
        key: textile.key,
        secret: '',
      });

      const identity = await Bucket.getIdentity();
      await Bucket.client.getToken(identity);
    }

    return Bucket.client;
  },

  getIdentity: async () => {
    const stored = localStorage.getItem('identity');
    if (!stored) {
      const identity = await Libp2pCryptoIdentity.fromRandom();
      localStorage.setItem('identity', identity.toString());
      return identity;
    }

    return Libp2pCryptoIdentity.fromString(stored);
  },

  getKey: async (bucketName) => {
    const client = await Bucket.getClient();

    const root = await client.open(bucketName);
    if (!root) {
      throw new Error(`Failed to open bucket ${bucketName}`);
    }
    console.debug('bucket', root);

    return root.key;
  },

  upload: async (bucketKey, path, ab) => {
    try {
      const client = await Bucket.getClient();
      return await client.pushPath(bucketKey, path, ab);
    } catch (err) {
      console.error(err);
    }
  },

  download: async (bucketKey, path) => {
    const client = await Bucket.getClient();

    const results = await client.pullPath(bucketKey, path);

    const arrays = [];
    for await (const result of results) {
      arrays.push(result);
    }

    const size = arrays.reduce((a, b) => a + b.byteLength, 0);
    const result = new Uint8Array(size);

    let offset = 0;
    for (const arr of arrays) {
      result.set(arr, offset);
      offset += arr.byteLength;
    }

    return result;
  },

  removeByName: async (bucketName) => {
    const client = await Bucket.getClient();
    const key = await Bucket.getKey(bucketName);
    await client.remove(key);
  },
};

export default Bucket;
