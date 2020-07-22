import React, { useRef, useEffect } from 'react';

import SimpleBar from 'simplebar-react';

import Image from './Image';

const ImagePreview = ({ images, removeImage }) => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.recalculate();
  }, [images]);

  return (
    <SimpleBar ref={ref} style={{ maxHeight: '130px' }}>
      {images.map((url, index) => (
        <Image
          key={index}
          url={url}
          removeImage={() => {
            removeImage(index);
            ref.current.recalculate();
          }}
        />
      ))}
    </SimpleBar>
  );
};

export default ImagePreview;
