import React, { useRef, useState, useEffect } from 'react';

import Buffer from 'buffer';
import {
  MDBIcon,
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
} from 'mdbreact';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';

import Uploader from '../../utils/file';
import EmptyRow from './EmptyRow';

import styles from './Upload.module.css';

const FileRow = ({ file, name, size, setSize }) => {
  const chunkSize = 256 * 1024 * 1024;

  const [error, setError] = useState('');
  const [status, setStatus] = useState('Queued');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fn = async () => {
      setStatus('Uploading');

      await Uploader(file, {
        size: chunkSize,
        callback: async (chunk, readSize) => {
          setSize(readSize);
          setProgress((_progress) => _progress + 100 * (readSize / file.size));
        },
      });

      setProgress(100);
      setStatus('Completed');
    };

    fn();
  }, []);

  return (
    <Row>
      <Col md="2">
        <MDBIcon icon="file-alt" className={styles['file-upload-icon']} />
      </Col>
      <Col md="10" className="pl-0">
        <Row>
          <Col md="9">
            <div className={styles['file-upload-progress-file-name']}>
              <b>{name}</b>
            </div>
          </Col>
          <Col md="3" className="text-right">
            {error === '' && progress === 100 ? (
              <MDBIcon icon="check" className="green-text" />
            ) : error !== '' && progress === 100 ? (
              <MDBIcon icon="exclamation-circle" className="red-text" />
            ) : (
              <MDBIcon pulse icon="spinner" />
            )}
          </Col>
        </Row>
        <Row>
          <Col md="5">
            <div style={{ fontSize: '11px', color: 'grey' }}>{size}</div>
          </Col>
          <Col md="7" className="text-right">
            <div style={{ fontSize: '12px', color: 'grey' }}>{status}</div>
          </Col>
        </Row>
        <Row>
          <ProgressBar
            striped
            animated
            variant="info"
            now={progress}
            style={{
              margin: '3px 15px 25px',
            }}
          />
        </Row>
      </Col>
    </Row>
  );
};

const Upload = ({ show, toggle }) => {
  const hiddenFileInput = useRef(null);
  const simpleBar = useRef(null);

  const [rows, setRows] = useState([]);
  const [uploaded, setUploaded] = useState([]);

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

        setRows((_rows) => [..._rows, { file, name, size }]);

        setUploaded((_uploaded) => [..._uploaded, file.name]);
        processedFiles.push(file);
      } else if (files.length === 1) {
        alert('File is already present in the upload dialog');
      }
    }

    // update total size;
    if (processedFiles.length > 0) {
      setTotalSize(newSize);

      const [_, _sizeH] = Uploader.File.props(null, newSize);
      setSizeH(_sizeH);
    }

    simpleBar.current.recalculate();
    hiddenFileInput.current.value = '';
  };

  return (
    <MDBModal isOpen={show} toggle={toggle}>
      <MDBModalHeader toggle={toggle} style={{ padding: '0.5rem' }}>
        <MDBBtn color="elegant" onClick={() => hiddenFileInput.current.click()}>
          Upload
        </MDBBtn>
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
                  {rows.map((item, index) => (
                    <FileRow
                      key={item.name}
                      file={item.file}
                      name={item.name}
                      size={item.size}
                      setSize={(newSize) =>
                        setReadSize((_readSize) => _readSize + newSize)
                      }
                    />
                  ))}
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
              multiple
              hidden
              ref={hiddenFileInput}
              onChange={onChange}
            />
            <Col md="3" id="file-upload-progress-total-display">
              <b>0.0%</b>
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
