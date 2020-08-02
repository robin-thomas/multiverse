import React, { useState } from 'react';

import { Card } from 'react-bootstrap';
import { MDBBtn, MDBIcon } from 'mdbreact';

import styles from './Image.module.css';

const Image = ({ url, index, removeImage }) => {
  const [overlay, setOverlay] = useState(false);

  const onMouseEnter = () => {
    setOverlay(true);
  };

  const onMouseLeave = () => {
    setOverlay(false);
  };

  const onRemoveImage = () => {
    removeImage(index);
  };

  return (
    <Card className={styles['about-card']} onMouseEnter={onMouseEnter}>
      <Card.Img
        variant="top"
        className={styles[`about-pic${overlay ? '-overlay-trigger' : ''}`]}
        src={url}
      />
      {overlay ? (
        <Card.ImgOverlay onMouseLeave={onMouseLeave}>
          <MDBBtn
            outline
            color="danger"
            title="Remove image"
            className={styles['about-delete-pic-icon']}
          >
            <MDBIcon icon="trash-alt" onClick={onRemoveImage} />
          </MDBBtn>
        </Card.ImgOverlay>
      ) : null}
    </Card>
  );
};

export default Image;
