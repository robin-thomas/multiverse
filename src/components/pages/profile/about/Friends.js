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
          border: '1px solid rgba(0,0,0,.2)',
          borderBottom: '0',
          borderRight: '0',
          borderTop: pic[2] >= 3 ? '1px solid rgba(0,0,0,1)' : '0',
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
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAQAAADa613fAAAAaUlEQVR42u3PQREAAAgDoC251Y3g34MGNJMXKiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiJyWeRuMgFyCP0cAAAAAElFTkSuQmCC',
        },
        false,
        index,
      ];
    }

    return [pics[index], true, index];
  };

  return (
    <>
      <Row>
        <Col md="auto">
          <Typography variant="button" display="block" gutterBottom>
            Friends
          </Typography>
        </Col>
        <Col md="auto" className="ml-auto">
          <Social count={pics.length} text="friends" title="Friends">
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
