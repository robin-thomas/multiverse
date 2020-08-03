import React, { useState } from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Fab from '@material-ui/core/Fab';
import CloseIcon from '@material-ui/icons/Close';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { Row, Col } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from './Post.module.css';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  root: {
    maxWidth: 775,
    flexGrow: 1,
  },
  img: {
    height: 500,
    display: 'block',
    maxWidth: 775,
    overflow: 'hidden',
    width: '100%',
  },
}));

const Photos = ({ loading, images }) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const maxSteps = images.length;

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return loading === true ? (
    <div className={styles['media-loading']}>
      <Row style={{ height: '100%' }}>
        <Col md="auto" className="mx-auto align-self-center">
          <CircularProgress className={styles['circular']} />
        </Col>
      </Row>
    </div>
  ) : images.length > 0 ? (
    <>
      <GridListTile className={styles['tile']}>
        <CardMedia
          className={styles['media']}
          image={images[0]}
          onClick={handleToggle}
        />
        {images.length > 0 ? (
          <GridListTileBar
            title={
              <Row>
                <Col md="auto">{images.length} photo(s)</Col>
              </Row>
            }
            className={styles['bottom-tile-bar']}
          />
        ) : null}
      </GridListTile>
      <Backdrop className={classes.backdrop} open={open}>
        <div className={classes.root}>
          <Fab
            onClick={handleClose}
            style={{ position: 'absolute', right: '20px', top: '20px' }}
          >
            <CloseIcon />
          </Fab>
          <AutoPlaySwipeableViews
            axis={'x'}
            index={activeStep}
            onChangeIndex={setActiveStep}
            enableMouseEvents
          >
            {images.map((image, index) => (
              <div key={index}>
                <img className={classes.img} src={image} />
              </div>
            ))}
          </AutoPlaySwipeableViews>
          <MobileStepper
            variant="dots"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            className={classes.root}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === images.length - 1}
              >
                Next
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                <KeyboardArrowLeft />
                Back
              </Button>
            }
          />
        </div>
      </Backdrop>
    </>
  ) : null;
};

export default Photos;
