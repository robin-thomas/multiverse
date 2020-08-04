import React, { useState, useEffect, useContext } from 'react';

import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import Box from '../../../../utils/3box';
import File from '../../../../utils/file';
import { DataContext } from '../../../utils/DataProvider';

const Picture = ({ height, pic }) => {
  return pic[0].address ? (
    <Link to={`/profile/${pic[0].address}`}>
      <Card square>
        <CardMedia
          style={{ height: height ? `${height}px` : '100px' }}
          image={pic[0].imgUrl}
        />
      </Card>
    </Link>
  ) : (
    <Card square>
      <CardMedia
        style={{
          height: height ? `${height}px` : '100px',
          border: '1px solid rgba(255,255,255,1)',
        }}
        image={pic[0].imgUrl}
      />
    </Card>
  );
};

const Friends = () => {
  const ctx = useContext(DataContext);

  const [pics, setPics] = useState([]);

  useEffect(() => {
    const fn = async () => {
      const friends = [];

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

            friends.push({ imgUrl, address });

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

      if (friends.length >= 0) {
        setPics(friends);
      }
    };

    if (ctx.profile.friends) {
      fn();
    }
  }, [ctx.profile.friends]);

  const getPic = (index) => {
    if (index >= pics.length) {
      return [
        {
          imgUrl:
            'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=',
        },
        false,
      ];
    }

    return [pics[index], true];
  };

  return (
    <>
      <Typography variant="button" display="block" gutterBottom>
        Friends
      </Typography>
      <Row noGutters={true} style={{ height: '100px' }}>
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
      <Row noGutters={true} style={{ height: '200px' }}>
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
          <Picture pic={getPic(4)} height="200" />
        </Col>
      </Row>
    </>
  );
};

export default Friends;
