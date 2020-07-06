const assert = require('assert');

const { ab2str, str2ab } = require('./arraybuffer');

describe('utils/arraybuffer', () => {
  it('arraybuffer <--> string conversion', async () => {
    const text = 'Hello, World!';
    assert.equal(text, ab2str(str2ab(text)));
  });
});
