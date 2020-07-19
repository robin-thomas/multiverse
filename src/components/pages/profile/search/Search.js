import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';

import Box from '../../../../utils/3box';
import Bucket from '../../../../utils/bucket';
import Ethers from '../../../../utils/ethers';
import SearchBox from './Box';
import SearchItems from '../FriendRequest';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    background: '#3f51b5',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    color: 'rgba(255,255,255,0.7)',
  },
  iconButton: {
    padding: 10,
    color: 'rgba(255,255,255,0.7)',
  },
}));

const Search = ({ history }) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [value, setValue] = useState('');
  const [disabled, setDisabled] = useState(true);

  const onChange = (_value) => {
    setDisabled(!_value || _value === '');
    setValue(_value);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !disabled) {
      search();
    }
  };

  const search = async () => {
    setDisabled(true);

    // Verify that the username exists.
    if (Ethers.isAddress(value)) {
      const data = await Box.getAllPublic(value);
      const username = Box.get(
        Box.DATASTORE_KEY_PROFILE_PUBLIC,
        'username',
        data
      );
      const profilePic = Box.get(
        Box.DATASTORE_KEY_PROFILE_PUBLIC,
        'profilePic',
        data
      );

      if (username) {
        let imgUrl = null;
        if (profilePic) {
          imgUrl = await Bucket.loadImage(profilePic, 100);
        }

        setItems([
          {
            username,
            address: value,
            imgUrl,
          },
        ]);

        setOpen(true);
      }
    }

    setDisabled(false);
  };

  return (
    <Paper className={classes.root}>
      <SearchBox
        open={open}
        setOpen={setOpen}
        icon={
          <IconButton className={classes.iconButton}>
            <MenuIcon />
          </IconButton>
        }
      >
        <div style={{ cursor: 'pointer' }}>
          {items.map((item, index) => (
            <SearchItems
              key={index}
              search={true}
              message={{ me: item }}
              onClick={() => {
                history.push(`/profile/${item.address}`);
              }}
            />
          ))}
        </div>
      </SearchBox>
      <InputBase
        className={classes.input}
        placeholder="Search Multiverse"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <IconButton
        className={classes.iconButton}
        onClick={search}
        disabled={disabled}
      >
        {disabled && value ? (
          <CircularProgress style={{ color: 'white' }} size={15} />
        ) : (
          <SearchIcon />
        )}
      </IconButton>
    </Paper>
  );
};

export default withRouter(Search);
