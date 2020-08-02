import React, { useContext } from 'react';

import { Row, Col } from 'react-bootstrap';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { DataContext } from '../../../utils/DataProvider';

import styles from './PostFooter.module.css';

const Comment = ({ comment, profilePic }) => (
  <>
    <Row>
      <Col md="auto" className="pr-0">
        <Tooltip title={comment.message.address}>
          <Avatar alt={comment.message.username} src={profilePic} />
        </Tooltip>
      </Col>
      <Col>
        <Card variant="outlined">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              @{comment.message.username}
            </Typography>
            <Typography variant="body2" component="p">
              {comment.message.comment}
            </Typography>
          </CardContent>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col md="auto" className="ml-auto text-right">
        <span className={styles['timestamp']}>
          {new Date(comment.timestamp * 1000).toLocaleString()}
        </span>
      </Col>
    </Row>
  </>
);

const Comments = ({ comments }) => {
  const ctx = useContext(DataContext);

  return comments.map((comment) => (
    <Comment
      key={comment.postId}
      comment={comment}
      profilePic={ctx.profilePics[comment.message.address]}
    />
  ));
};

export default Comments;
