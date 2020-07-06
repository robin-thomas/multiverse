const { BufferListStream } = require('bl');
const Hash = require('ipfs-only-hash');
const IpfsHttpClient = require('ipfs-http-client');

const { ab2str } = require('./arraybuffer');

const config = require('../../config.json');

const ipfs = IpfsHttpClient({
  protocol: config.ipfs.protocol,
  host: config.ipfs.host,
  port: config.ipfs.port,
});

exports.str2hash = (input) => Hash.of(ab2str(input));

exports.IPFS = {
  upload: async (buf) => {
    let input = buf;
    if (!Buffer.isBuffer(buf)) {
      input = Buffer.from(buf);
    }

    const hashes = [];
    for await (const result of ipfs.add(input)) {
      hashes.push(result.path);
    }
    return hashes;
  },

  download: async (cid) => {
    const bl = new BufferListStream();

    for await (const result of ipfs.get(cid)) {
      for await (const data of result.content) {
        bl.append(data);
      }
    }

    return bl;
  },
};
