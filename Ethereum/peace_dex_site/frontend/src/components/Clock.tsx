/* eslint-disable camelcase */
import React, { useEffect, useState, useRef } from "react";
import styled from 'styled-components'

const StyledClock = styled.div`
  font-size: 0.8rem;
  position: absolute;
  top: 100px;
  right: 25%;
  left: 25%;
  background: #4bbafa;
  padding: 6px 10px;
  border-radius: 30px;
  border: solid 2px #FFFFFF;
  text-align: center;
  z-index: 1;
  color: #fff;
  &.Ended {
    background: #FFFFFF;
    border: solid 2px #ff8181;
  }
  .Clock-days, .Clock-hours, .Clock-minutes, .Clock-seconds {
    font-weight: bold;
    display: inline-block;
    margin-right: 5px;
    font-size: 15px;
  }
`
export interface ClockProps {
  deadline?: number
}

const Clock : React.FC<ClockProps> = ({ deadline }) => {
  const [_days, setDays] = useState(0);
  const [_hours, setHours] = useState(0);
  const [_minutes, setMinutes] = useState(0);
  const [_seconds, setSeconds] = useState(0);
  const [_isEnded, setEnd] = useState(false);
  const _mountTime = useRef(0);

  const leading0 = (num) => {
    return num < 10 ? `0${num}` : num;
  }
  
  const getTimeUntil = (delta_time: number) => {
    // eslint-disable-next-line camelcase
    const time = delta_time - _mountTime.current;
    const value = _mountTime.current;
    if (time < 0) {
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      setEnd(true);
    } else {
      const seconds = Math.floor((time / 1000) % 60);
      const minutes = Math.floor((time / 1000 / 60) % 60);
      const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
      const days = Math.floor(time / (1000 * 60 * 60 * 24));
      setDays(days);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
      _mountTime.current = value + 1000;
    }
  }

  useEffect(() => {
    getTimeUntil(deadline);
    const intervalID = setInterval(() => getTimeUntil(deadline), 1000);
    return () => clearInterval(intervalID);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline]);

  return (
    <StyledClock className={_isEnded ? 'Ended' : ''}>
      {_isEnded && (
        <span style={{color: "red"}} >Staking Ended</span>
      )}
      {!_isEnded && (
        <>
          <div className="Clock-days">{leading0(_days)}d</div>
          <div className="Clock-hours">
            {leading0(_hours)}h
          </div>
          <div className="Clock-minutes">
            {leading0(_minutes)}m
          </div>
          <div className="Clock-seconds">
            {leading0(_seconds)}s
          </div>  
        </>
      )}
    </StyledClock>
  );
}
export default Clock;
