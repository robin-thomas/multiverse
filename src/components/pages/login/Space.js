import React, { useEffect, useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';

import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Link from '@material-ui/core/Link';

import Page from './Page';
import { DataContext } from '../../utils/DataProvider';

import Bucket from '../../../utils/bucket';
import Box from '../../../utils/3box/index.js';

import styles from './Page.module.css';

import { textile } from '../../../../config.json';

const LoginPrompt = () => (
  <Alert severity="info" className={styles['alert']}>
    <AlertTitle>#OwnYourData</AlertTitle>
    <p>
      All your profile information will be stored securely on your{' '}
      <b>3Box account.</b>. Please authorize access to your 3Box account to
      continue (if first time). If you don't have a 3Box account, one shall be
      created for you.
    </p>
    <hr />
    <p>
      Learn more about 3Box{' '}
      <Link href="https://3box.io/" target="_blank" color="inherit">
        <strong>here</strong>
      </Link>
    </p>
  </Alert>
);

const Space = ({ setStage }) => {
  const ctx = useContext(DataContext);

  const [redirect, setRedirect] = useState(false);
  const [errorNext, setErrorNext] = useState(<LoginPrompt />);

  useEffect(() => {
    const fn = async () => {
      // Setup the 3box space.
      try {
        const [bucketKey] = await Promise.all([
          Bucket.getKey(textile.buckets.profile.bucket),
          Box.getAll(ctx.address),
        ]);
        console.log('data', Box.storage);

        ctx.setBucketKeys((_bucketKeys) => {
          return { ..._bucketKeys, profilePic: bucketKey };
        });

        let keypair = Box.get(
          Box.DATASTORE_KEY_PROFILE_PRIVATE,
          'keys.keypair'
        );

        if (!keypair) {
          // Create encryptionKey and keypair
          const encryptionKey = Box.crypto.symmetric.genKey();

          keypair = (await Box.crypto.asymmetric.genKeypair()).toString();

          Box.set(
            Box.DATASTORE_KEY_PROFILE_PRIVATE,
            {
              keys: {
                encryptionKeys: {
                  [ctx.address]: encryptionKey,
                },
                keypair,
              },
            },
            ctx.setProfilePrivate
          );
        }

        // get all pending friend requests.
        const requests = await Box.message.request.getAll(ctx.address);
        ctx.setFriendRequests(requests);

        if (!Box.get(Box.DATASTORE_KEY_PROFILE_PUBLIC, 'username')) {
          setStage(2);
        } else {
          setRedirect(true);
        }
      } catch (err) {
        // TODO: metamask rejections doesnt seem to be handled by 3box.

        console.log('3box error', err);
      }
    };

    fn();
  }, [ctx.address]);

  return (
    <>
      {redirect ? (
        <Redirect to={`/profile/${ctx.address}`} />
      ) : (
        <Page
          loader={true}
          text="Setting Up Your Space"
          errorNext={errorNext}
        />
      )}
    </>
  );
};

export default Space;
