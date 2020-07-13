import React, { useEffect, useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { v4 as uuidV4 } from 'uuid';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Link from '@material-ui/core/Link';

import Page from './Page';
import { DataContext } from '../../utils/DataProvider';

import Box from '../../../utils/3box';

import styles from './Page.module.css';

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

const Space = () => {
  const ctx = useContext(DataContext);

  const [redirect, setRedirect] = useState(false);
  const [errorNext, setErrorNext] = useState(<LoginPrompt />);

  useEffect(() => {
    const fn = async () => {
      // Setup the 3box space.
      try {
        await Box.set(Box.DATASTORE_KEY_THEME, ctx.theme, {
          address: ctx.address,
        });

        // Setup an encrypting key (if not set).
        let key = await Box.get([Box.DATASTORE_KEY_ENCRYPTION_KEY], {
          address: ctx.address,
        });

        if (key === null) {
          key = uuidV4();

          await Box.set(Box.DATASTORE_KEY_ENCRYPTION_KEY, key, {
            address: ctx.address,
          });
        }
        ctx.setEncryptionKey(key);

        // get all pending friend requests.
        const requests = await Box.message.request.getAll(ctx.address);
        ctx.setFriendRequests(requests);

        setRedirect(true);
      } catch (err) {
        // TODO: metamask rejections doesnt seem to be handled by 3box.

        console.log(err);
      }
    };

    fn();
  }, [ctx.theme, ctx.address]);

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
