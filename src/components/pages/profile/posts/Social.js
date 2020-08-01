import React, { useState } from 'react';

import Link from '@material-ui/core/Link';
import { MDBModal, MDBModalHeader, MDBModalBody } from 'mdbreact';

import styles from './PostFooter.module.css';

const Social = ({ count, text, children }) => {
  const [openModal, setOpenModal] = useState(false);

  const toggleModal = () => setOpenModal((_open) => !_open);

  return count !== null ? (
    <>
      {count > 0 ? (
        <Link href="#" onClick={toggleModal} color="inherit">
          <span className={styles['likes']}>
            {count} {text}
          </span>
        </Link>
      ) : (
        <span className={styles['likes']}>
          {count} {text}
        </span>
      )}
      {text === 'likes' ? <span>&nbsp;.&nbsp;</span> : null}
      <MDBModal isOpen={openModal} toggle={toggleModal} centered>
        <MDBModalHeader toggle={toggleModal}>
          <span className={styles['capitalize']}>{text}</span>
        </MDBModalHeader>
        <MDBModalBody>{children}</MDBModalBody>
      </MDBModal>
    </>
  ) : null;
};

export default Social;
