import React, { useState, useEffect, useContext } from 'react';

import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import { Row, Col } from 'react-bootstrap';

import Like from './Like';
import Social from './Social';
import Comment from './Comment';
import Comments from './Comments';
import Box from '../../../../utils/3box';
import { DataContext } from '../../../utils/DataProvider';

const PostFooter = ({ address }) => {
  const ctx = useContext(DataContext);

  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(-1);
  const [likeId, setLikeId] = useState(null);
  const [likeCount, setLikeCount] = useState(null);

  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(null);

  const init = (posts) => {
    const _likes = posts.filter((e) => e.message.like);
    const _comments = posts.filter((e) => e.message.comment);

    setLikeCount(_likes.length);
    setCommentCount(_comments.length);

    const like = _likes.find((e) => e.message.address === ctx.address);
    if (like) {
      setLiked(1);
      setLikeId(like.postId);
    } else {
      setLiked(0);
    }

    setLikes(_likes);
    setComments(_comments);
  };

  useEffect(() => {
    const fn = async () => {
      console.debug('post thread', address);

      let posts;
      if (Box.message.box) {
        const thread = await Box.message.joinThreadByAddress(address);
        posts = await thread.getPosts();
        thread.onUpdate(() => thread.getPosts().then(init));
      } else {
        posts = await Box.getPostsByAddress(address);
      }

      init(posts);
    };

    if (address) {
      fn();
    }
  }, [address]);

  const toggleLike = async () => {
    const currentLike = liked;
    setLiked(-1);

    const thread = await Box.message.joinThreadByAddress(address);
    if (currentLike === 0) {
      await thread.post({
        like: true,
        address: ctx.address,
        username: ctx.profilePrivate.username,
        profilePic: ctx.profilePrivate.profilePic,
      });
    } else {
      await thread.deletePost(likeId);
    }
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
        <Col className={`align-self-center ${ctx.address ? 'pl-0' : ''}`}>
          <Social count={likeCount} text="likes">
            {likes.map((like, index) => (
              <Like
                key={like.postId}
                like={like}
                profilePic={ctx.profilePics[like.message.address]}
              />
            ))}
          </Social>
          <Social count={commentCount} text="comments">
            <Comments comments={comments} />
          </Social>
        </Col>
      </Row>
      <Comment
        address={ctx.address}
        tAddress={address}
        username={ctx.profilePrivate.username}
        profilePic={ctx.profilePics[ctx.address]}
      />
    </>
  );
};

export default PostFooter;
