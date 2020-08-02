import React from 'react';

import Button from '@material-ui/core/Button';

import Upload from '../../../utils/upload';

const UploadButton = ({
  bucketKey,
  setShow,
  setImages,
  setImageFileNames,
  ...props
}) => {
  const onClick = () => {
    setShow(true);
  };

  const toggle = () => {
    setShow((_show) => !_show);
  };

  const addImageUrl = (_imageUrl) => {
    setImages((_images) => [..._images, _imageUrl]);
  };

  const addFileNames = (_fileNames) => {
    console.debug('_fileNames', _fileNames);
    setImageFileNames((_names) => [..._names, _fileNames]);
  };

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        color="primary"
        disabled={!bucketKey}
        onClick={onClick}
      >
        Upload images
      </Button>
      <Upload
        toggle={toggle}
        bucketKey={bucketKey}
        addImageUrl={addImageUrl}
        addFileNames={addFileNames}
        {...props}
      />
    </>
  );
};

export default UploadButton;
