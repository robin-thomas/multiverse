import React, { useState } from 'react';

import Editor from 'react-froala-wysiwyg';
import { MDBBtn, MDBIcon, MDBCard, MDBCardBody, MDBCardTitle } from 'mdbreact';
import { Container, Row, Col } from 'react-bootstrap';

import Image from './Image';
import EmptyRow from '../../../utils/EmptyRow';
import Upload from '../../../utils/upload';

import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

const Post = () => {
  const [images, setImages] = useState([]);
  const [imageRows, setImageRows] = useState([]);
  const [uploaded, setUploaded] = useState([]);
  const [show, setShow] = useState(false);
  const [input, setInput] = useState('');

  return (
    <Container>
      <MDBCard>
        <MDBCardBody>
          <MDBCardTitle>Add a new post</MDBCardTitle>
          <hr />
          <Row>
            <Col md="9" className="text-right">
              <MDBIcon
                icon="images"
                title="Upload images"
                size="2x"
                style={{ marginBottom: '10px', cursor: 'pointer' }}
                onClick={() => setShow(true)}
              />
              <Upload
                show={show}
                toggle={() => setShow(!show)}
                addImageUrl={(imageUrl) =>
                  setImages((_images) => [..._images, imageUrl])
                }
                imageRows={imageRows}
                setImageRows={setImageRows}
                uploaded={uploaded}
                setUploaded={setUploaded}
              />
            </Col>
          </Row>
          <Row>
            <Col md="9">
              <Editor tag="textarea" model={input} onModelChange={setInput} />
            </Col>
            <Col md="3"></Col>
          </Row>
          <EmptyRow />
          <Row>
            <Col md="9">
              <Row>
                {images.map((url, index) => (
                  <Col
                    md="2"
                    key={url.substr(25, 20) + url.substr(url.length - 20)}
                  >
                    <Image
                      url={url}
                      removeImage={() => {
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
                      }}
                    />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col md="auto" className="pr-0">
              <MDBBtn color="elegant">Create post</MDBBtn>
            </Col>
            <Col md="auto" className="pl-0">
              <MDBBtn color="info">Preview</MDBBtn>
            </Col>
          </Row>
        </MDBCardBody>
      </MDBCard>
    </Container>
  );
};

export default Post;
