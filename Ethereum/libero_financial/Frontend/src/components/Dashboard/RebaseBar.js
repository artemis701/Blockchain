import React, { useRef, useState, useCallback, useEffect } from "react";
import { useSelector } from 'react-redux';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { createGlobalStyle } from 'styled-components';
import { getUTCNow, LoadingSkeleton } from '../../components/utils';
import { getRebaseFrequency, getNextRebase } from "../../core/web3";
import * as selectors from '../../store/selectors';

const GlobalStyles = createGlobalStyle`
  .progress-content {
    width: 100%;
    border-radius: 50%;
    padding: 10px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
  }

  .rebase-content {
    position: absolute;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
    .rebase-title {
      font-size: 16px;
      @media only screen and (max-width: 1500px) and (min-width: 1200px) {
        font-size: 12px;
      }
    }
    .rebase-time {
      font-size: 24px;
      @media only screen and (max-width: 1500px) and (min-width: 1200px) {
        font-size: 20px;
      }
    }
  }
`;

function CapBackGradientSVG() {
  const gradientTransform = `rotate(0)`;
  return (
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id={"capBack"} gradientTransform={gradientTransform}>
          <stop offset="0%" stopColor="rgb(47, 40, 85, 0.5)" />
          <stop offset="100%" stopColor="rgb(47, 40, 85, 0.5)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function CapGradientSVG() {
  const gradientTransform = `rotate(20)`;
  return (
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id={"cap"} gradientTransform={gradientTransform}>
          <stop offset="0%" stopColor="rgb(255, 184, 77)" />
          <stop offset="100%" stopColor="rgb(255, 184, 77)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const RebaseBar = ({ center = false }) => {
  const nextRebase = useRef(null);
  const web3 = useSelector(selectors.web3State);
  const [minutes, setMin] = useState('');
  const [seconds, setSec] = useState('');
  const [percent, setPercent] = useState(100);
  const [counter, setCounter] = useState(0);
  const [timerId, setTimerId] = useState(0);
  const [interval, setRebaseInterval] = useState(0);
  const [loading, setLoading] = useState(false);

  const leading0 = (num) => {
    return num < 10 ? "0" + num : num;
  }

  const checkNextRebase = useCallback(async () => {
    if (!web3) {
      return;
    }
    setLoading(true);
    let result = await getRebaseFrequency();
    if (result.success) {
      setRebaseInterval(result.rebaseFrequency);
    }
    result = await getNextRebase();
    if (result.success) {
      nextRebase.current = Number(result.nextRebase) * 1000; //(Date.now() / 1000 + 70) * 1000;
    }
    setLoading(false);
  }, [web3]);

  const getTimeUntil = () => {
    const time = nextRebase.current - getUTCNow();
    if (time < 0) {
      setMin(0);
      setSec(0);
    } else {
      let sec = Math.floor((time / 1000) % 60);
      let min = Math.floor((time / 1000 / 60));
      let perc = 0;
      if (time > interval * 1000) {
        perc = 100;
      } else {
        perc = (time / 1000 * 100) / interval;
      }
      
      setSec(sec);
      setMin(min);
      setPercent(perc);
    }
  };

  useEffect(() => {
    checkNextRebase();
  }, [checkNextRebase]);

  useEffect(() => {
    return () => {
      clearInterval(timerId);
    }
  }, [timerId]);

  useEffect(() => {
    if (nextRebase.current > 0 && interval > 0 && counter === 0) {
      const _timerId = setInterval(() => getTimeUntil(), 1000);
      setCounter(prevState => prevState + 1);
      setTimerId(_timerId);
    }
  }, [nextRebase.current, interval, counter]);


  useEffect(() => {
    if (minutes === 0 && seconds === 0) {
      setTimeout(() => checkNextRebase(), 5000);
    }
  }, [minutes, seconds]);

  return (
    <>
      <GlobalStyles />
      <div className={center ? 'progress-content m-auto' : 'progress-content'}>
        <CapBackGradientSVG />
        <CapGradientSVG />
        <CircularProgressbar
          value={percent}
          counterClockwise={true}
          strokeWidth={10}
          styles={buildStyles({
            pathColor: `url(#cap)`,
            textColor: 'white',
            textSize: 16,
            strokeLinecap: "butt",
            trailColor: `url(#capBack)`
          })}
        />
        <div className="rebase-content">
          <p className="text-center f-century rebase-title">TIME UNTIL<br />NEXT REBASE</p>
          {minutes === 0 && seconds === 0 ? (
            <p className="text-center fw-bold rebase-time fs-20">
              Rebasing...
            </p>
          ) : (
            <p className="text-center fw-bold rebase-time">
              {loading ? <LoadingSkeleton width={50}/> : leading0(Number(minutes)) + ':' + leading0(Number(seconds)) }
            </p>
          )}
      </div>
    </div>
    </>
  );
}
export default RebaseBar;
