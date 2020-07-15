import React, { useRef, useState } from 'react';

import {
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
} from 'mdbreact';
import { Container, Row, Col } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';

import Empty from './Empty';
import Footer from './Footer';
import ImageRow from './ImageRow';
import Uploader from '../../../utils/file';

import styles from './Upload.module.css';

const Upload = ({
  show,
  toggle,
  multiple,
  addImageUrl,
  imageRows,
  setImageRows,
  uploaded,
  setUploaded,
  addImageHashes,
  resize,
  bucketKey,
  filePath,
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
      if (!uploaded || !uploaded.includes(file.name)) {
        const [name, size] = Uploader.File.props(file.name, file.size);
        newSize += file.size;

        setImageRows((_rows) => [..._rows, { file, name, size }]);

        if (setUploaded) {
          setUploaded((_uploaded) => [..._uploaded, file.name]);
        }
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
          disabled={!multiple && imageRows.length > 0}
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
                        item={item}
                        setSize={(newSize) =>
                          setReadSize((_readSize) => _readSize + newSize)
                        }
                        addImageUrl={addImageUrl}
                        addImageHashes={addImageHashes}
                        resize={resize}
                        bucketKey={bucketKey}
                        filePath={filePath}
                      />
                    ))
                  ) : (
                    <Empty />
                  )}
                </div>
              </SimpleBar>
            </Col>
          </Row>
        </Container>
      </MDBModalBody>
      <MDBModalFooter>
        <Footer
          hiddenFileInput={hiddenFileInput}
          onChange={onChange}
          readSize={readSize}
          totalSize={totalSize}
          sizeH={sizeH}
          multiple={multiple}
        />
      </MDBModalFooter>
    </MDBModal>
  );
};

export default Upload;
