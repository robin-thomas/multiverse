import React, { useState } from 'react';

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
import ShareIcon from '@material-ui/icons/Share';

import { Row, Col } from 'react-bootstrap';

import Alert from '../Alert';

const ShareButton = ({ url }) => {
  const [open, setOpen] = useState(false);

  return (
    <Alert
      count={0}
      setCount={() => {}}
      open={open}
      setOpen={setOpen}
      icon={<ShareIcon />}
    >
      <Row style={{ height: '60px' }}>
        <Col className="pr-0 text-center align-self-center">
          <FacebookShareButton url={url}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </Col>
        <Col className="pr-0 text-center align-self-center">
          <TwitterShareButton url={url}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </Col>
        <Col className="pr-0 text-center align-self-center">
          <RedditShareButton url={url}>
            <RedditIcon size={32} round />
          </RedditShareButton>
        </Col>
        <Col className="pr-0 text-center align-self-center">
          <PinterestShareButton url={url}>
            <PinterestIcon size={32} round />
          </PinterestShareButton>
        </Col>
        <Col className="text-center align-self-center">
          <LinkedinShareButton url={url}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </Col>
      </Row>
    </Alert>
  );
};

export default ShareButton;
