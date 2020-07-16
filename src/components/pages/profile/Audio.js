import React, { useEffect, useRef, useState } from 'react';

import { Row, Col } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import { MDBProgress } from 'mdbreact';
import Slider from '@material-ui/core/Slider';
import VolumeUp from '@material-ui/icons/VolumeUp';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

import AudioUtil from '../../../utils/audio';

const useStyles = makeStyles((theme) => ({
  slider: {
    padding: '3px',
  },
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
  },
}));

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current();

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const Audio = () => {
  // const [disabled, setDisabled] = useState(true);

  const classes = useStyles();

  const [song, setSong] = useState({});
  const [value, setValue] = useState(0);
  const [timer, setTimer] = useState(null);
  const [audio, setAudio] = useState(null);
  const [volume, setVolume] = useState(5);
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState('00:00');

  useEffect(() => {
    const url =
      'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3';

    AudioUtil.loadSong(url).then((audiobuffer) => {
      if (audio) {
        audio.context.decodeAudioData(
          audiobuffer,
          (buffer) => {
            if (current !== null) {
              current.disconnect();
            }

            const _current = audio.context.createBufferSource();
            _current.buffer = buffer;
            setCurrent(_current);
          },
          console.error
        );
      }
    });
  }, [audio]);

  useEffect(() => {
    if (current && audio) {
      current.connect(audio.analyser);

      audio.analyser.connect(audio.gainNode);
      audio.gainNode.connect(audio.context.destination);
      audio.node.connect(audio.context.destination);
      audio.gainNode.gain.value = volume / 10.0;

      if (song.when && song.offset) {
        current.start(song.when, song.offset);
      } else {
        current.start(0);
      }

      if (audio.context.state === 'suspended') {
        audio.context.resume();
      }

      let offset = (new Date() - audio.created) / 1000;
      if (offset > audio.context.currentTime) {
        offset = audio.context.currentTime;
      }

      setSong({ offset, duration: current.buffer.duration });
      setPlaying(true);
    }
  }, [current]);

  useInterval(() => {
    if (
      audio &&
      audio.context &&
      audio.context.state !== 'suspended' &&
      current
    ) {
      const time = audio.context.currentTime - song.offset;
      const seconds = parseInt(time || 0);

      const progress = 100.0 * (seconds / song.duration);
      setValue(progress);

      if (progress <= 100) {
        const min = Math.floor(seconds / 60);
        const sec = seconds - min * 60;
        setTimeDisplay(
          `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
        );
      } else {
        // Finished playing.
        setValue(0);
        setTimeDisplay('00:00');
        setPlaying(false);
        clearInterval(timer);

        current.start(0);
      }
    }
  }, 1000);

  const play = () => {
    if (!audio) {
      const _audio = AudioUtil.init();
      setAudio(_audio);
    } else {
      audio.context.resume();
      setPlaying(true);
    }
  };

  const pause = () => {
    if (audio) {
      audio.context.suspend();
      setPlaying(false);
      clearInterval(timer);
    }
  };

  const updateVolume = (_, newVolume) => {
    if (audio) {
      audio.gainNode.gain.value = newVolume / 10;
    }
    setVolume(newVolume);
  };

  return (
    <Card style={{ width: '550px', background: 'rgba(0,0,0,0.8)' }} id="audio">
      <Row>
        <Col md="auto" className="pr-0">
          {playing ? (
            <IconButton onClick={pause} color="primary">
              <PauseIcon />
            </IconButton>
          ) : (
            <IconButton onClick={play} color="primary">
              <PlayArrowIcon />
            </IconButton>
          )}
        </Col>
        <Divider
          orientation="vertical"
          flexItem
          light
          className={classes.light}
        />
        <Col md="7" className="align-self-center">
          <Row>
            <Col md="10" className="pr-0" className="align-self-center">
              <MDBProgress value={value} />
            </Col>
            <Col
              md="auto"
              className="pl-0 ml-auto"
              style={{ color: '#3f51b5' }}
            >
              {timeDisplay}
            </Col>
          </Row>
        </Col>
        <Divider
          orientation="vertical"
          flexItem
          light
          className={classes.light}
        />
        <Col md="3" className="align-self-center">
          <Row>
            <Col md="auto" className="align-self-center pr-0">
              <VolumeUp color="primary" />
            </Col>
            <Col className="align-self-center">
              <Slider
                color="primary"
                className={classes.slider}
                value={volume}
                onChange={updateVolume}
                min={0}
                max={10}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default Audio;
