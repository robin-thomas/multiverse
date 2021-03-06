import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';

import Box from '../../../../utils/3box';
import File from '../../../../utils/file';
import Ethers from '../../../../utils/ethers';
import SearchBox from './Box';
import SearchItems from '../FriendRequest';
import { DataContext } from '../../../utils/DataProvider';

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
  const ctx = useContext(DataContext);

  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [value, setValue] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [searchDisabled, setSearchDisabled] = useState(false);

  const onClick = (item) => {
    setValue('');
    history.push(`/profile/${item.address}`);
  };

  const onChange = (e) => {
    const _value = e.target.value;
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
    setSearchDisabled(true);

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
        if (profilePic) {
          if (!ctx.profilePics[value]) {
            const imgUrl = await File.avatar(profilePic);

            ctx.setProfilePics((_pics) => {
              return {
                ..._pics,
                [value]: imgUrl,
              };
            });
          }
        }

        setItems([
          {
            username,
            address: value,
          },
        ]);

        setOpen(true);
      }
    }

    setDisabled(false);
    setSearchDisabled(false);
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
              onClick={() => onClick(item)}
            />
          ))}
        </div>
      </SearchBox>
      <InputBase
        className={classes.input}
        placeholder="Search Multiverse"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={searchDisabled}
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
