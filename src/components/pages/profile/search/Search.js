import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

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

const Search = () => {
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.root}>
      <IconButton className={classes.iconButton}>
        <MenuIcon />
      </IconButton>
      <InputBase className={classes.input} placeholder="Search Multiverse" />
      <IconButton type="submit" className={classes.iconButton}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default Search;
