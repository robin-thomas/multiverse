import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import { green } from '@material-ui/core/colors';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import Box from '../../../../utils/3box';
import Crypto from '../../../../utils/crypto';
import Bucket from '../../../../utils/bucket';
import Content from '../../../app/Content';
import ImagePreview from './ImagePreview';
import Visibility from './Visibility';
import UploadButton from './UploadButton';
import Editor from '../../../utils/Editor';
import { DataContext } from '../../../utils/DataProvider';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 750,
  },
  rounded: {
    color: '#fff',
    backgroundColor: green[500],
  },
  cardHeader: {
    paddingBottom: 0,
  },
  cardContent: {
    paddingTop: 0,
  },
  cardAction: {
    padding: 0,
    paddingBottom: '8px',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const Post = ({ history }) => {
  const ctx = useContext(DataContext);

  const classes = useStyles();

  const [postId, setPostId] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [bucketKey, setBucketKey] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [images, setImages] = useState([]);
  const [imageRows, setImageRows] = useState([]);
  const [uploaded, setUploaded] = useState([]);
  const [show, setShow] = useState(false);
  const [input, setInput] = useState('');
  const [visibility, setVisibility] = useState(0);
  const [imageFileNames, setImageFileNames] = useState([]);

  useEffect(() => {
    const now = new Date().getTime();
    setPostId(now.toString());

    const key = Crypto.symmetric.genKey();
    setEncryptionKey(key);

    Bucket.getKey(now.toString()).then(setBucketKey);
  }, []);

  const createPost = async () => {
    setOpen(true);

    // Create a thread for likes & comments.
    const thread = await Box.message.createPostThread(postId);

    const post = JSON.stringify({
      id: postId,
      bucket: bucketKey,
      content: input,
      thread,
      attachments: {
        image: imageFileNames,
        audio: '',
      },
    });
    const encryptedPost = Crypto.symmetric.encrypt(encryptionKey, post);

    // private or friends.
    let key = encryptionKey;
    if (visibility < 2) {
      key = Crypto.symmetric.encrypt(
        ctx.profilePrivate.keys.encryptionKeys[ctx.address],
        encryptionKey
      );
    }

    const arg = {
      posts: {
        [postId]: {
          key,
          post: encryptedPost,
          timestamp: new Date().getTime(),
          visibility,
        },
      },
    };

    if (visibility > 0) {
      Box.set(Box.DATASTORE_KEY_PROFILE_PUBLIC, arg);
    } else {
      Box.set(Box.DATASTORE_KEY_PROFILE_PRIVATE, arg);
    }
    console.debug('Post created', arg);

    setOpen(false);
    history.push(`/profile/${ctx.address}`);
  };

  const removeImage = (index) => {
    setImages((_images) => [
      ..._images.slice(0, index),
      ..._images.slice(index + 1),
    ]);
    setImageRows((_imageRows) => [
      ..._imageRows.slice(0, index),
      ..._imageRows.slice(index + 1),
    ]);
    setUploaded((_uploaded) => [
      ..._uploaded.slice(0, index),
      ..._uploaded.slice(index + 1),
    ]);
    setImageFileNames((_names) => [
      ..._names.slice(0, index),
      ..._names.slice(index + 1),
    ]);
  };

  return (
    <Content>
      {ctx.address ? (
        <>
          <Row style={{ height: '100vh' }}>
            <Col md="auto" className="mx-auto align-self-center">
              <Card className={classes.root} variant="outlined">
                <CardHeader
                  className={classes.cardHeader}
                  avatar={
                    <Avatar variant="rounded" className={classes.rounded}>
                      <AssignmentIcon />
                    </Avatar>
                  }
                  title="Add a new post"
                  titleTypographyProps={{
                    variant: 'overline',
                  }}
                />
                <CardContent className={classes.cardContent}>
                  <hr />
                  <Row>
                    <Col>
                      <CardActions className={classes.cardAction}>
                        <UploadButton
                          show={show}
                          setShow={setShow}
                          imageRows={imageRows}
                          setImageRows={setImageRows}
                          bucketKey={bucketKey}
                          uploaded={uploaded}
                          setUploaded={setUploaded}
                          setImages={setImages}
                          setImageFileNames={setImageFileNames}
                          multiple={true}
                          resize={100}
                          encryptionKey={encryptionKey}
                        />
                      </CardActions>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Editor input={input} setInput={setInput} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="8" style={{ marginBottom: '15px' }}>
                      <Visibility setVisibility={setVisibility} />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ImagePreview images={images} removeImage={removeImage} />
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col md="auto">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CloudUploadIcon />}
                        onClick={createPost}
                      >
                        Create Post
                      </Button>
                    </Col>
                  </Row>
                </CardContent>
              </Card>
            </Col>
          </Row>
          <Backdrop className={classes.backdrop} open={open}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      ) : (
        <Redirect to="/" />
      )}
    </Content>
  );
};

export default withRouter(React.memo(Post));
