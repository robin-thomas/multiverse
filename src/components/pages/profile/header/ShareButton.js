import React, { useState, useRef } from 'react';

import { MDBBtn, MDBIcon } from 'mdbreact';
import { Row, Col, Overlay, Popover } from 'react-bootstrap';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
} from 'react-share';

import styles from './ShareButton.module.css';

const ShareButton = ({ url }) => {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };

  return (
    <>
      <MDBBtn
        outline
        color="success"
        className={styles['share-profile']}
        onClick={handleClick}
      >
        <MDBIcon icon="share-square" />
        &nbsp;Share profile
      </MDBBtn>
      <Overlay
        show={show}
        target={target}
        placement="bottom"
        container={ref.current}
        containerPadding={20}
      >
        <Popover>
          <Popover.Content>
            <Row>
              <Col className="pr-0">
                <FacebookShareButton url={url}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
              </Col>
              <Col className="pr-0">
                <TwitterShareButton url={url}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
              </Col>
              <Col className="pr-0">
                <RedditShareButton url={url}>
                  <RedditIcon size={32} round />
                </RedditShareButton>
              </Col>
              <Col className="pr-0">
                <PinterestShareButton url={url}>
                  <PinterestIcon size={32} round />
                </PinterestShareButton>
              </Col>
              <Col>
                <LinkedinShareButton url={url}>
                  <LinkedinIcon size={32} round />
                </LinkedinShareButton>
              </Col>
            </Row>
          </Popover.Content>
        </Popover>
      </Overlay>
    </>
  );
};

export default ShareButton;
