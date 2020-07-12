import React, { useRef, useState } from 'react';

import {
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
} from 'mdbreact';
import { Alert, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';

import ImageRow from './ImageRow';
import EmptyRow from '../../../../utils/EmptyRow';
import Uploader from '../../../../../utils/file';

import styles from './Upload.module.css';

const Upload = ({
  show,
  toggle,
  addImageUrl,
  imageRows,
  setImageRows,
  uploaded,
  setUploaded,
  addImageHashes,
}) => {
  const hiddenFileInput = useRef(null);
  const simpleBar = useRef(null);

  const [sizeH, setSizeH] = useState(0);
  const [readSize, setReadSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);

  const onChange = (e) => {
    let newSize = totalSize;
    const processedFiles = [];

    const files = e.target.files;
    for (const file of files) {
      if (!uploaded.includes(file.name)) {
        const [name, size] = Uploader.File.props(file.name, file.size);
        newSize += file.size;

        setImageRows((_rows) => [..._rows, { file, name, size }]);

        setUploaded((_uploaded) => [..._uploaded, file.name]);
        processedFiles.push(file);
      } else if (files.length === 1) {
        alert('File is already uploaded!');
      }
    }

    // update total size;
    if (processedFiles.length > 0) {
      setTotalSize(newSize);

      const [, _sizeH] = Uploader.File.props(null, newSize);
      setSizeH(_sizeH);
    }

    simpleBar.current.recalculate();
    hiddenFileInput.current.value = '';
  };

  const formatNum = (num) => (isNaN(num) ? 0.0 : num);

  const onToggle = () => {
    if (show) {
      setImageRows([]);
      setSizeH(0);
      setReadSize(0);
      setTotalSize(0);
    }
    toggle();
  };

  return (
    <MDBModal isOpen={show} toggle={onToggle} disableBackdrop={true}>
      <MDBModalHeader toggle={onToggle} style={{ padding: '0.5rem' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon />}
          onClick={() => hiddenFileInput.current.click()}
        >
          Upload
        </Button>
      </MDBModalHeader>
      <MDBModalBody>
        <Container>
          <Row>
            <Col>
              <SimpleBar
                ref={simpleBar}
                className={styles['file-upload-progress']}
              >
                <div className={styles['file-upload-progress-container']}>
                  {imageRows.length > 0 ? (
                    imageRows.map((item, index) => (
                      <ImageRow
                        key={item.name}
                        file={item.file}
                        name={item.name}
                        size={item.size}
                        setSize={(newSize) =>
                          setReadSize((_readSize) => _readSize + newSize)
                        }
                        addImageUrl={addImageUrl}
                        addImageHashes={addImageHashes}
                      />
                    ))
                  ) : (
                    <>
                      <EmptyRow />
                      <Row>
                        <Col className="text-center">
                          <MDBIcon
                            icon="exclamation-circle"
                            size="3x"
                            style={{ marginBottom: '10px' }}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col className="text-center">
                          <h2>Nothing to upload yet.</h2>
                        </Col>
                      </Row>
                      <EmptyRow rows={2} />
                      <Row>
                        <Col className="text-center">
                          <Alert variant="primary">
                            <b>Duplicate images</b> will not be re-uploaded
                            unless removed
                          </Alert>
                        </Col>
                      </Row>
                    </>
                  )}
                </div>
              </SimpleBar>
            </Col>
          </Row>
        </Container>
      </MDBModalBody>
      <MDBModalFooter>
        <Container>
          <Row>
            <Col>
              <ProgressBar
                striped
                animated
                variant="info"
                now={100 * (readSize / totalSize)}
              />
            </Col>
          </Row>
          <Row className={styles['file-upload-progress-footer']}>
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              multiple
              hidden
              ref={hiddenFileInput}
              onChange={onChange}
            />
            <Col md="3" id="file-upload-progress-total-display">
              <b>{formatNum(100.0 * (readSize / totalSize))}%</b>
            </Col>
            <Col md="3"></Col>
            <Col
              md="6"
              className={styles['file-upload-progress-total-size-display']}
            >
              Total <b>{sizeH}</b>
            </Col>
          </Row>
        </Container>
      </MDBModalFooter>
    </MDBModal>
  );
};

export default Upload;
