import tweetnacl from 'tweetnacl';
import pbkdf2 from 'pbkdf2';
import fernet from 'fernet';
import CryptoJS from 'crypto-js';
import { ethers } from 'ethers';

import Keypair from './keypair';
import Nonce from './nonce';

import { app } from '../../../config.json';

const NONCE_LENGTH = 24;
const FERNET_SECRET_LENGTH = 32;

const randomString = () => {
  let result = '';

  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLen = chars.length;
  for (let i = 0; i < FERNET_SECRET_LENGTH; ++i) {
    result += chars.charAt(Math.floor(Math.random() * charsLen));
  }

  return result;
};

const Crypto = {
  symmetric: {
    genKey: () => {
      let key = CryptoJS.SHA256(randomString()).toString(CryptoJS.enc.Base64);

      let secret = fernet.decode64toHex(key);
      while (secret.length !== fernet.hexBits(256)) {
        key = CryptoJS.SHA256(randomString()).toString(CryptoJS.enc.Base64);
        secret = fernet.decode64toHex(key);
      }

      return key;
    },

    encrypt: (secretKey, msg) => {
      const secret = new fernet.Secret(secretKey);
      const token = new fernet.Token({ secret, ttl: 0 });
      return token.encode(msg);
    },

    decrypt: (secretKey, msg) => {
      const secret = new fernet.Secret(secretKey);
      const token = new fernet.Token({
        secret,
        ttl: 0,
        token: msg,
      });

      return token.decode();
    },
  },

  asymmetric: {
    genKeypair: async (address) => {
      const salt = CryptoJS.SHA256(address).toString(CryptoJS.enc.Base64);

      const msg = `I'm signing this message as ${address} to generate my ${app.name} keypair`;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(msg);

      const keypair = tweetnacl.box.keyPair.fromSecretKey(
        pbkdf2.pbkdf2Sync(signature, salt, 1000, 32)
      );

      return new Keypair(keypair);
    },

    genNonce: () => new Nonce(tweetnacl.randomBytes(NONCE_LENGTH)),

    encrypt: (msg, nonce, keypair) => {
      nonce = Nonce.fromString(nonce);
      keypair = Keypair.fromString(keypair);

      const encoder = new TextEncoder();
      const encoded = encoder.encode(msg);

      return tweetnacl.box(
        encoded,
        nonce,
        keypair.publicKey,
        keypair.secretKey
      );
    },

    decrypt: (msg, nonce, keypair) => {
      nonce = Nonce.fromString(nonce);
      keypair = Keypair.fromString(keypair);

      const decoder = new TextDecoder();
      const encoded = tweetnacl.box.open(
        msg,
        nonce,
        keypair.publicKey,
        keypair.secretKey
      );

      if (!encoded) {
        throw new Error('Decryption failed');
      }

      return decoder.decode(encoded);
    },
  },
};

export default Crypto;
