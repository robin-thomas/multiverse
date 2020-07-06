const assert = require('assert');
const { JSDOM } = require('jsdom');

const uploader = require('./file');
const { ab2str } = require('./arraybuffer');
const { str2hash, IPFS } = require('./ipfs');

describe('utils/file', () => {
  let blob;
  const text = 'Hello, World!';

  const callback = async (buf) => ab2str(buf);

  before(() => {
    global.window = new JSDOM('', { runScripts: 'dangerously' }).window;
    blob = new global.window.Blob([text], { type: 'text/plain' });
  });

  it('chunk size of 1', async () => {
    const uploads = await uploader(blob, { size: 1, callback });
    assert.equal(uploads.join(''), text);
  });

  it('chunk size of 5', async () => {
    const uploads = await uploader(blob, { size: 5, callback });
    assert.equal(uploads.join(''), text);
  });

  it('1 chunk, with upload to ipfs', async () => {
    const callback = async (buf) => str2hash(buf);
    const ipfsCallback = async (buf) => IPFS.upload(buf);

    try {
      let uploads = await uploader(blob, { size: text.length, callback });
      const ipfsHash = uploads.join('');

      uploads = await uploader(blob, {
        size: text.length,
        callback: ipfsCallback,
      });
      assert.equal(uploads.join(''), ipfsHash);

      const bls = await IPFS.download(ipfsHash);
      assert.equal(bls.toString(), text);
    } catch (err) {
      assert.fail(err);
    }
  }).timeout(5000);

  it('1 chunk, with upload to ipfs as string from callback', async () => {
    const callback = async (buf) => str2hash(buf);
    const ipfsCallback = async (buf) => IPFS.upload(Buffer.from(ab2str(buf)));

    try {
      let uploads = await uploader(blob, { size: text.length, callback });
      const ipfsHash = uploads.join('');

      uploads = await uploader(blob, {
        size: text.length,
        callback: ipfsCallback,
      });
      assert.equal(uploads.join(''), ipfsHash);

      const bls = await IPFS.download(ipfsHash);
      assert.equal(bls.toString(), text);
    } catch (err) {
      assert.fail(err);
    }
  }).timeout(5000);
});
