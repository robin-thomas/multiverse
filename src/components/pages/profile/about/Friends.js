import React, { useState, useEffect, useContext } from 'react';

import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import Like from '../posts/Like';
import Social from '../posts/Social';
import Box from '../../../../utils/3box';
import File from '../../../../utils/file';
import { DataContext } from '../../../utils/DataProvider';

const Picture = ({ height, pic }) => {
  return pic[0].address ? (
    <Link to={`/profile/${pic[0].address}`}>
      <Card square style={{ boxShadow: 'none' }}>
        <CardMedia
          style={{ height: height ? `${height}vh` : '7vh' }}
          image={pic[0].imgUrl}
        />
      </Card>
    </Link>
  ) : null;
};

const Friends = () => {
  const ctx = useContext(DataContext);

  const [pics, setPics] = useState([]);
  const [count, setCount] = useState(null);

  useEffect(() => {
    const fn = async () => {
      const friends = [];
      setPics(friends);
      setCount(friends.length);

      for (const address of Object.keys(ctx.profile.friends)) {
        if (!ctx.profilePics[address]) {
          const data = await Box.getAllPublic(address);
          const pic = Box.get(
            Box.DATASTORE_KEY_PROFILE_PUBLIC,
            'profilePic',
            data
          );

          if (pic) {
            const imgUrl = await File.avatar(pic);

            friends.push({
              imgUrl,
              address,
              username: ctx.profile.friends[address].username,
            });

            ctx.setProfilePics((_pics) => {
              return {
                ..._pics,
                [address]: imgUrl,
              };
            });
          }
        } else {
          friends.push({ imgUrl: ctx.profilePics[address], address });
        }
      }

      setPics(friends);
      setCount(friends.length);
    };

    if (ctx.profile.address) {
      fn();
    }
  }, [ctx.profile.address, ctx.profile.friends]);

  const getPic = (index) => {
    if (index >= pics.length) {
      return [{ imgUrl: '' }, false, index];
    }

    return [pics[index], true, index];
  };

  return pics.length > 0 ? (
    <>
      <Row>
        <Col md="auto">
          <Typography variant="button" display="block" gutterBottom>
            Friends
          </Typography>
        </Col>
        <Col md="auto" className="ml-auto">
          <Social count={count} text="friends" title="Friends">
            {pics.map((friend, index) => (
              <Like
                key={index}
                like={{ message: friend }}
                profilePic={ctx.profilePics[friend.address]}
              />
            ))}
          </Social>
        </Col>
      </Row>
      <Row noGutters={true}>
        <Col md="4">
          <Picture pic={getPic(0)} />
        </Col>
        <Col md="4">
          <Picture pic={getPic(1)} />
        </Col>
        <Col md="4">
          <Picture pic={getPic(2)} />
        </Col>
      </Row>
      <Row noGutters={true}>
        <Col md="4">
          <Row noGutters={true}>
            <Col>
              <Picture pic={getPic(3)} />
            </Col>
          </Row>
          <Row noGutters={true}>
            <Col>
              <Picture pic={getPic(5)} />
            </Col>
          </Row>
        </Col>
        <Col md="8">
          <Picture pic={getPic(4)} height="14" />
        </Col>
      </Row>
    </>
  ) : null;
};

export default Friends;
