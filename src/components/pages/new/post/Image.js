import React, { useState } from 'react';

import { Card } from 'react-bootstrap';
import { MDBBtn, MDBIcon } from 'mdbreact';

import styles from './Image.module.css';

const Image = ({ url, removeImage }) => {
  const [overlay, setOverlay] = useState(false);

  return (
    <Card className={styles['about-card']}>
      <Card.Img
        variant="top"
        className={styles[`about-pic${overlay ? '-overlay-trigger' : ''}`]}
        src={url}
        onMouseEnter={() => setOverlay(true)}
      />
      {overlay ? (
        <Card.ImgOverlay onMouseLeave={() => setOverlay(false)}>
          <MDBBtn
            outline
            color="danger"
            title="Remove image"
            className={styles['about-delete-pic-icon']}
          >
            <MDBIcon icon="trash-alt" size="lg" onClick={removeImage} />
          </MDBBtn>
        </Card.ImgOverlay>
      ) : null}
    </Card>
  );
};

export default Image;
