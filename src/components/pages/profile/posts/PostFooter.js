import React, { useState, useEffect, useContext } from 'react';

import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Row, Col } from 'react-bootstrap';

import Box from '../../../../utils/3box';
import { DataContext } from '../../../utils/DataProvider';

import styles from './PostFooter.module.css';

const PostFooter = ({ address }) => {
  const ctx = useContext(DataContext);

  const [liked, setLiked] = useState(-1);
  const [likeId, setLikeId] = useState(null);
  const [likeCount, setLikeCount] = useState(null);

  useEffect(() => {
    const fn = async () => {
      // Search through the post thread, and find all the comments, likes.
      // Store the count.
      // Get the likeId, commentId (if any).
      const thread = await Box.message.joinThreadByAddress(address);
      const posts = await thread.getPosts();
      const likes = posts.filter((e) => e.like);

      setLikeCount(likes.length);

      const like = likes.find((e) => e.address === ctx.address);
      if (like) {
        setLiked(1);
      } else {
        setLiked(0);
      }
    };

    if (address) {
      fn();
    }
  }, [address]);

  const toggleLike = async () => {
    const currentLike = liked;
    setLiked(0);

    const thread = await Box.message.joinThreadByAddress(address);
    if (currentLike === 0) {
      const _postId = await thread.post({ like: true, address: ctx.address });
      setLikeId(_postId);
      setLikeCount((_count) => _count + 1);
    } else {
      await thread.deletePost(likeId);
      setLikeId(null);
      setLikeCount((_count) => _count - 1);
    }

    setLiked((_liked) => (_liked + 1) % 2);
  };

  return (
    <>
      <Row>
        {ctx.address ? (
          <Col md="auto" className="align-self-center pr-0">
            <IconButton
              color="secondary"
              component="span"
              disabled={liked === -1}
              onClick={toggleLike}
            >
              {liked === 1 ? (
                <FavoriteIcon fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
          </Col>
        ) : null}
        <Col className="pl-0 align-self-center">
          {likeCount !== null ? (
            <span className={styles['likes']}>{likeCount} likes</span>
          ) : null}
        </Col>
      </Row>
    </>
  );
};

export default PostFooter;
