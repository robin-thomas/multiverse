const uploader = async (file, chunk) => {
  const chunker = (offset) => {
    return new Promise((resolve, reject) => {
      const _chunk = file.slice(offset, offset + chunk.size);

      const _reader = new window.FileReader();
      _reader.onload = (e) => chunk.callback(e.target.result).then(resolve);
      _reader.readAsArrayBuffer(_chunk);
    });
  };

  const promises = Array.from(
    Array(Math.ceil(file.size / chunk.size)),
    (_, i) => chunker(i * chunk.size)
  );

  return await Promise.all(promises);
};

module.exports = uploader;
