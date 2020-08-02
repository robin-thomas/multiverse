import React, { useRef, useEffect } from 'react';

import SimpleBar from 'simplebar-react';

import Image from './Image';

const ImagePreview = ({ images, removeImage }) => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.recalculate();
  }, [images]);

  const onRemoveImage = (index) => {
    removeImage(index);
    ref.current.recalculate();
  };

  return (
    <SimpleBar ref={ref} style={{ maxHeight: '130px' }}>
      {images.map((url, index) => (
        <Image
          key={index}
          url={url}
          index={index}
          removeImage={onRemoveImage}
        />
      ))}
    </SimpleBar>
  );
};

export default ImagePreview;
