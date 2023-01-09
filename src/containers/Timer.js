import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
require("moment-duration-format");

// Helper function that calculates time until completion.
// Returns a moment object.
function calculateDuration(endMoment, nowMoment = moment()) {
  if (!endMoment) {
    return moment.duration(0);
  } else {
    return moment.duration(endMoment.diff(nowMoment));
  }
}

const Timer = ({ endTime, oneMinuteTime, oneMinuteWarning, timerFinished, prepend, style }) => {
  const [isWithinOneMinute, setIsWithinOneMinute] = useState(false);

  useEffect(() => {
    const tick = () => {
      if (endTime && !isWithinOneMinute && moment().isAfter(oneMinuteTime)) {
        // If the one minute warning hasn't fired, the endTime is valid, and the oneMinuteTime has passed.
        oneMinuteWarning();
      } else if (endTime && (moment().isSame(endTime) || moment().isAfter(endTime))) {
        timerFinished();
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endTime, isWithinOneMinute, oneMinuteTime, oneMinuteWarning, timerFinished]);

  const durationAsString = calculateDuration(endTime).format("mm:ss", { trim: false });
  const practiceTextColor = isWithinOneMinute ? '#dd3f3e' : '#fff';

  return (
    <Text style={{ color: practiceTextColor, ...style }}>
      {(prepend || "")  + durationAsString}
    </Text>
  );
};

Timer.propTypes = {
  endTime: PropTypes.object, // the time at which the timer will halt (callback: timerFinished)
  oneMinuteTime: PropTypes.object, // the time at which the timer will reach 1 minute (callback: oneMinuteWarning)
  oneMinuteWarning: PropTypes.func,
  timerFinished: PropTypes.func,
  prepend: PropTypes.string, // Text to prepend to the timer value
  style: PropTypes.object,
};

Timer.defaultProps = {
  endTime: null,
  oneMinuteTime: null,
  oneMinuteWarning() {},
  timerFinished() {},
};

export default Timer;