exports.ab2str = (buf) => {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

exports.str2ab = (str) => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, len = str.length; i < len; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};
