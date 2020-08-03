import React, { useState, useEffect } from 'react';

import Moment from '../../utils/moment';

const formatTime = (time) => Moment(time).fromNow();

const Timer = (props) => {
  const time = !props.time ? new Date() : new Date(props.time * 1000);
  const [timeStr, setTimeStr] = useState(formatTime(time));

  useEffect(() => {
    const timer = setInterval(() => setTimeStr(formatTime(time)), 1000);
    return () => clearInterval(timer);
  }, [time]);

  return <span>{timeStr}</span>;
};

export default Timer;
