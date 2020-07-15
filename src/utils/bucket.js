import { Buckets, withKeyInfo } from '@textile/hub';
import { Libp2pCryptoIdentity } from '@textile/threads-core';

import { textile } from '../../config.json';

const Bucket = {
  client: null,

  getClient: async () => {
    if (Bucket.client === null) {
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
      console.log(root);
      return root.key;
    } else {
      const created = await client.init(bucketName);
      console.log('bucket', created);
      return created.root ? created.root.key : null;
    }
  },

  upload: async (bucketKey, path, ab) => {
    console.log(bucketKey, path, ab);
    const client = await Bucket.getClient();
    await client.pushPath(bucketKey, path, ab);
  },

  download: async (bucketName, path) => {
    const client = await Bucket.getClient();

    const bucketKey = await Bucket.getKey(bucketName);

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
};

export default Bucket;
