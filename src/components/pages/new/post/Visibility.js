import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import ShareIcon from '@material-ui/icons/Share';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: '15px',
  },
  margin: {
    margin: theme.spacing(1),
  },
  padding: {
    padding: theme.spacing(4),
  },
}));

const steps = [
  {
    value: 0,
    label: 'Only Me',
  },
  {
    value: 50,
    label: 'Friends',
  },
  {
    value: 100,
    label: 'All',
  },
];

const Visibility = ({ setVisibility }) => {
  const classes = useStyles();

  const valueLabelFormat = (value) =>
    steps.findIndex((step) => step.value === value);

  const onChange = (value) => setVisibility(valueLabelFormat(value));

  return (
    <div className={classes.root}>
      <Grid container spacing={5} alignItems="center">
        <Grid item>
          <Avatar className={classes.padding}>
            <ShareIcon fontSize="large" />
          </Avatar>
        </Grid>
        <Grid item md>
          <Slider
            defaultValue={0}
            valueLabelFormat={valueLabelFormat}
            getAriaValueText={(value) => value}
            aria-labelledby="discrete-slider-restrict"
            step={null}
            valueLabelDisplay="off"
            marks={steps}
            onChangeCommitted={(e, value) => onChange(value)}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Visibility;
