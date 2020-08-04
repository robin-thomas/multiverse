import { Buffer } from 'buffer';

import Crypto from './crypto';
import Image from './image';
import Bucket from './bucket';
import { str2ab } from './arraybuffer';

import { app, textile } from '../../config.json';

const File = {
  props: (fileName, size) => {
    if (fileName) {
      const index = fileName.lastIndexOf('.');
      const ext = fileName.substr(index + 1);

      let name = fileName.substr(0, index);
      if ((name + ext).length > 20) {
        name = `${name.substr(0, 3)}...${name.substr(name.length - 11)}`;
      }
      fileName = `${name}.${ext}`;
    }

    const sizes = ['B', 'kB', 'MB', 'GB'];
    const factor = Math.floor((size.toString().length - 1) / 3);
    const fileSize = (size / Math.pow(1024, factor)).toFixed(2) + sizes[factor];

    return [fileName, fileSize];
  },

  upload: async (file, callback) => {
    const chunker = (offset, index) => {
      return new Promise((resolve, reject) => {
        const _chunk = file.slice(offset, offset + app.chunk.size);

        const _reader = new window.FileReader();
        _reader.onload = (e) =>
          callback(e.target.result, _chunk.size, index).then(resolve);
        _reader.readAsArrayBuffer(_chunk);
      });
    };

    const results = [];
    const len = Math.ceil(file.size / app.chunk.size);
    for (let i = 0; i < len; ++i) {
      const result = await chunker(i * app.chunk.size, i);
      results.push(result);
    }

    return results;
  },

  imageUpload: async (
    file,
    bucketKey,
    progress,
    resize = null,
    encryptionKey = null
  ) => {
    const path = Math.random().toString(36).substr(2);

    const results = await File.upload(file, async (chunk, size, index) => {
      let data = chunk;
      if (encryptionKey) {
        const hex = Buffer.from(chunk).toString('hex');
        const encrypted = Crypto.symmetric.encrypt(encryptionKey, hex);
        data = str2ab(encrypted);
      }

      const key = `${path}_${file.type.replace('/', '---')}_${index}`;
      await Bucket.upload(bucketKey, key, data);

      progress(size);

      return { chunk, path: key };
    });

    const paths = results.map((e) => e.path);

    if (resize) {
      const blob = new Blob(
        results.map((e) => e.chunk),
        { type: file.type }
      );
      const url = URL.createObjectURL(blob);
      const resizedUrl = await Image.resize(url, resize);
      return { resizedUrl, paths };
    }

    return { paths };
  },

  loadImage: async (bucketKey, paths, resize = null, decryptionKey = null) => {
    const type = `image/${paths[0].match(/(.*)_image---(.*)_[0-9]+$/)[2]}`;

    const promises = paths.map((path) => Bucket.download(bucketKey, path));
    const chunks = await Promise.all(promises);

    if (decryptionKey) {
      chunks.forEach((chunk, index) => {
        const hex = Buffer.from(chunk).toString();
        const decrypted = Crypto.symmetric.decrypt(decryptionKey, hex);
        const data = Buffer.from(decrypted, 'hex');

        const ab = new ArrayBuffer(data.length);
        const view = new Uint8Array(ab);
        for (let i = 0; i < data.length; ++i) {
          view[i] = data[i];
        }

        chunks[index] = ab;
      });
    }

    const url = URL.createObjectURL(new Blob(chunks, { type }));
    return await Image.resize(url, resize);
  },

  loadImageByName: async (
    bucketName,
    paths,
    resize = null,
    decryptionKey = null
  ) => {
    const bucketKey = await Bucket.getKey(bucketName);
    return await File.loadImage(bucketKey, paths, resize, decryptionKey);
  },

  avatar: async (pic) => {
    return await File.loadImageByName(textile.buckets.profile, pic, 150);
  },
};

export default File;
