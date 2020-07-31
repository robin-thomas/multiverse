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

      const identity = await Libp2pCryptoIdentity.fromRandom();
      await Bucket.client.getToken(identity);
    }

    return Bucket.client;
  },

  getKey: async (bucketName) => {
    const client = await Bucket.getClient();

    const root = await client.open(bucketName);

    if (root) {
      console.debug('root bucket', root, bucketName);
      return root.key;
    } else {
      const created = await client.init(bucketName);
      console.debug('bucket', created);
      return created.root ? created.root.key : null;
    }
  },

  upload: async (bucketKey, path, ab) => {
    console.log(bucketKey, path);
    const client = await Bucket.getClient();
    return await client.pushPath(bucketKey, path, ab);
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
