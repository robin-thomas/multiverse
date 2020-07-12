const uploader = async (file, chunk) => {
  const chunker = (offset) => {
    return new Promise((resolve, reject) => {
      const _chunk = file.slice(offset, offset + chunk.size);

      const _reader = new window.FileReader();
      _reader.onload = (e) =>
        chunk.callback(e.target.result, _chunk.size).then(resolve);
      _reader.readAsArrayBuffer(_chunk);
    });
  };

  const promises = Array.from(
    Array(Math.ceil(file.size / chunk.size)),
    (_, i) => chunker(i * chunk.size)
  );

  return await Promise.all(promises);
};

uploader.File = {
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
};

export default uploader;
