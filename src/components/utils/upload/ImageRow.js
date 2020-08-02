import React, { useState, useEffect } from 'react';

import { MDBIcon } from 'mdbreact';
import { Row, Col, ProgressBar } from 'react-bootstrap';

import File from '../../../utils/file';

import styles from './ImageRow.module.css';

const ImageRow = ({
  item,
  setSize,
  addImageUrl,
  addFileNames,
  resize,
  bucketKey,
  encryptionKey,
}) => {
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Queued');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fn = async () => {
      try {
        setStatus('Uploading');

        const { resizedUrl, paths } = await File.imageUpload(
          item.file,
          bucketKey,
          (_size) => {
            setSize(_size);
            setProgress(
              (_progress) => _progress + 100 * (_size / item.file.size)
            );
          },
          resize,
          encryptionKey
        );

        console.debug(`Uploaded image to ${bucketKey}`, paths);

        addImageUrl(resizedUrl);
        addFileNames(paths);

        setProgress(100);
        setStatus('Completed');
      } catch (err) {
        console.error(err);
      }
    };

    fn();
  }, []);

  return (
    <Row>
      <Col md="2">
        <MDBIcon icon="file-alt" className={styles['file-upload-icon']} />
      </Col>
      <Col md="10" className="pl-0 align-self-center">
        <Row>
          <Col md="9">
            <div className={styles['file-upload-progress-file-name']}>
              <b>{item.name}</b>
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
            <div className={styles['file-upload-size']}>{item.size}</div>
          </Col>
          <Col md="7" className="text-right">
            <div className={styles['file-upload-status']}>{status}</div>
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

export default React.memo(ImageRow);
