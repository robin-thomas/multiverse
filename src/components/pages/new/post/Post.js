import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router';

import { makeStyles } from '@material-ui/core/styles';

import Editor from 'react-froala-wysiwyg';
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

import Content from '../../../app/Content';
import ImagePreview from './ImagePreview';
import Visibility from './Visibility';
import Upload from '../../../utils/upload';
import { DataContext } from '../../../utils/DataProvider';

import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

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

  const [open, setOpen] = React.useState(false);
  const [images, setImages] = useState([]);
  const [imageRows, setImageRows] = useState([]);
  const [uploaded, setUploaded] = useState([]);
  const [show, setShow] = useState(false);
  const [input, setInput] = useState('');
  const [visibility, setVisibility] = useState(0);
  const [imageHashes, setImageHashes] = useState([]);

  const createPost = () => {
    setOpen(true);

    const redirect = () => {
      setOpen(false);
      history.push(`/profile/${ctx.address}`);
    };

    const post = {
      text: input,
      images: imageHashes,
      visibility,
    };

    // TODO: store the post.

    // fake delay.
    const sleep = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, 1000 * ms));
    };
    sleep(5).then(redirect);
  };

  return (
    <Content>
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
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => setShow(true)}
                    >
                      Upload images
                    </Button>
                    <Upload
                      show={show}
                      toggle={() => setShow(!show)}
                      imageRows={imageRows}
                      setImageRows={setImageRows}
                      uploaded={uploaded}
                      setUploaded={setUploaded}
                      addImageUrl={(_imageUrl) =>
                        setImages((_images) => [..._images, _imageUrl])
                      }
                      addImageHashes={(_imageHashes) =>
                        setImageHashes((_hashes) => [..._hashes, _imageHashes])
                      }
                      multiple={true}
                      resize={100}
                    />
                  </CardActions>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Editor
                    tag="textarea"
                    model={input}
                    onModelChange={setInput}
                    config={{
                      toolbarButtons: [
                        'bold',
                        'italic',
                        'underline',
                        'undo',
                        'redo',
                      ],
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="8" style={{ marginBottom: '15px' }}>
                  <Visibility setVisibility={setVisibility} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <ImagePreview
                    images={images}
                    removeImage={(index) => {
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
                      setImageHashes((_hashes) => [
                        ..._hashes.slice(0, index),
                        ..._hashes.slice(index + 1),
                      ]);
                    }}
                  />
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
    </Content>
  );
};

export default withRouter(Post);
