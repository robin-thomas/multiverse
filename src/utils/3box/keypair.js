const Keypair = function (keypair) {
  this.keypair = keypair;
};

Keypair.prototype.toString = function () {
  if (this.keypair === null) {
    return null;
  }

  return {
    publicKey: this.keypair.publicKey.toString(),
    secretKey: this.keypair.secretKey.toString(),
  };
};

Keypair.fromString = (keypair) => {
  if (keypair === null) {
    return null;
  }

  return {
    publicKey: new Uint8Array(keypair.publicKey.split(',')),
    secretKey: new Uint8Array(keypair.secretKey.split(',')),
  };
};

export default Keypair;
