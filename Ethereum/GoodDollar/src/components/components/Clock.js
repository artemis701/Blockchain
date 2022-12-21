import React, { Component } from "react";
import { getUTCNow, getDeadlineTimestamp } from "../../utils";

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      status: 0, // 0: Not started yet, 1: start, 2: end
    };
  }
  componentDidMount() {
    const { startTime, duration, handleStatus } = this.props;
    if (getUTCNow() < startTime) {
      this.setState({ status: 0 });
      handleStatus(0);
    } else {
      const deadline = getDeadlineTimestamp(startTime, duration);
      this.getTimeUntil(deadline);
      setInterval(() => this.getTimeUntil(deadline), 1000);
    }
  }
  leading0(num) {
    return num < 10 ? "0" + num : num;
  }
  getTimeUntil(deadline) {
    const time = deadline - getUTCNow();
    if (isNaN(time) || time < 0) {
      this.setState({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 2 });
      if (this.state.status !== 2) {
        this.setState({ status: 2 });
        this.props.handleStatus(2);
      }
    } else {
      const seconds = Math.floor((time / 1000) % 60);
      const minutes = Math.floor((time / 1000 / 60) % 60);
      const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
      const days = Math.floor(time / (1000 * 60 * 60 * 24));
      this.setState({ days, hours, minutes, seconds });
      if (this.state.status !== 1) {
        this.setState({ status: 1 });
        this.props.handleStatus(1);
      }
    }
  }
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }
  render() {
    const { status } = this.state;
    return (
      <div>
        {status === 0 && (
          <div style={{color: '#ff7581'}}>Not started yet</div>
        )}
        {status === 2 && (
          <div>TweetStorm ended</div>
        )}
        {status === 1 && (
          <>
            <div className="Clock-days">{this.leading0(this.state.days)}d</div>
            <div className="Clock-hours">
              {this.leading0(this.state.hours)}h
            </div>
            <div className="Clock-minutes">
              {this.leading0(this.state.minutes)}m
            </div>
            <div className="Clock-seconds">
              {this.leading0(this.state.seconds)}s
            </div>
          </>
        )}

      </div>
    );
  }
}
export default Clock;
