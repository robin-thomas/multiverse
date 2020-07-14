import tweetnacl from 'tweetnacl';
import pbkdf2 from 'pbkdf2';
import CryptoJS from 'crypto-js';
import { ethers } from 'ethers';

import Keypair from './keypair';
import Nonce from './nonce';

import { app } from '../../../config.json';

const NONCE_LENGTH = 24;

const Crypto = {
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