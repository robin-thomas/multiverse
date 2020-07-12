import React, { useState, useEffect } from 'react';

import { MDBIcon } from 'mdbreact';
import { Row, Col, ProgressBar } from 'react-bootstrap';

import Uploader from '../../../utils/file';
import Image from '../../../utils/image';

import styles from './ImageRow.module.css';

import { app } from '../../../../config.json';

const ImageRow = ({
  file,
  name,
  size,
  setSize,
  addImageUrl,
  addImageHashes,
}) => {
  const chunkSize = app.chunk.size;

  const [error, setError] = useState('');
  const [status, setStatus] = useState('Queued');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fn = async () => {
      setStatus('Uploading');

      const results = await Uploader(file, {
        size: chunkSize,
        callback: async (chunk, readSize) => {
          setSize(readSize);
          setProgress((_progress) => _progress + 100 * (readSize / file.size));

          // TODO: upload to IPFS and get the hash.

          return { chunk, hash: Math.random().toString(36) };
        },
      });

      const blob = new Blob(
        results.map((e) => e.chunk),
        { type: file.type }
      );
      const url = URL.createObjectURL(blob);
      const resizedUrl = await Image.resize(url, 100);
      addImageUrl(resizedUrl);
      addImageHashes(results.map((e) => e.hash));

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
            <div className={styles['file-upload-size']}>{size}</div>
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
