const Image = {
  resize: (src, maxWidth) => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.onload = () => {
        const c = document.createElement('canvas');
        const ctx = c.getContext('2d');

        const scale = !maxWidth ? 1 : maxWidth / img.width;
        c.width = img.width * scale;
        c.height = img.height * scale;

        ctx.drawImage(img, 0, 0, c.width, c.height);

        resolve(c.toDataURL());
      };
      img.src = src;
    });
  },
};

module.exports = Image;
