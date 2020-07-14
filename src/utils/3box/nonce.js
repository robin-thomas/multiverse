const Nonce = function (nonce) {
  this.nonce = nonce;
};

Nonce.prototype.toString = function () {
  if (this.nonce === null) {
    return null;
  }

  return this.nonce.toString();
};

Nonce.fromString = (nonce) => {
  if (nonce === null) {
    return null;
  }

  return new Uint8Array(nonce.split(','));
};

export default Nonce;
