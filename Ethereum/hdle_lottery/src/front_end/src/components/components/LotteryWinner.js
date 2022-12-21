import React from "react";
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import { getStringDate, isNewTime, isEmpty, fromWei } from "../../utils";
import { getTopWinner} from "../../core/graphql";
import { isContract } from "../../core/web3";

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;

const numberArray = (num) => {
  var digits = num.toString().split('');
  return digits.map(Number);
}

class LotteryWinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weekly_winner: { addr: '0', ticketID: 0, time: 0, price: 0 },
      weekly_ticketID: [],
      bi_daily_winner: { addr: '0', ticketID: 0, time: 0, price: 0 },
      bi_daily_ticketID: []
    }
  }

  resetWalletAddress = (_addr) => {
    if (_addr === "0" || !_addr || isContract(_addr)) {
      return "No chosen";
    }
    let str_addr = _addr.toString();
    return str_addr.slice(0, 6) + '.....' + str_addr.slice(str_addr.length - 5, str_addr.length);
  }

  async componentDidMount() {
    let { weekly_winner, bi_daily_winner, weekly_ticketID, bi_daily_ticketID } = this.state;
    let ret1 = await getTopWinner(0, true);
    if (ret1.length > 0) {
      weekly_winner = ret1[0];
      weekly_ticketID = numberArray(Number(ret1[0].ticketID) + 10000);
    }
    let ret2 = await getTopWinner(1, true);
    if (ret2.length > 0) {
      bi_daily_winner = ret2[0];
      bi_daily_ticketID = numberArray(Number(ret2[0].ticketID) + 10000);
    }
    this.setState({ weekly_winner, bi_daily_winner, weekly_ticketID, bi_daily_ticketID });
  }

  componentWillUnmount() {

  }

  render() {
    const { weekly_winner, bi_daily_winner, weekly_ticketID, bi_daily_ticketID } = this.state;
    return (
      <>
        <section className="container">
          <div className="content mx-auto">
            <div className="row m-t-60 mb-6 msg-content">
              <div className="col-md-12 mb-2">
                <div className='text-center'>
                  <h2 className='text-app-title'>Previous Winners</h2>
                </div>
              </div>
              <div className="col-md-5 offset-md-1 col-sm-6">
                <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={800} triggerOnce>
                  <div className="msg-content-item gap-10">
                    {isNewTime(Number(weekly_winner.time)) && (
                      <div className="new-icon">NEW</div>
                    )}
                    <div className="msg-date">{getStringDate(Number(weekly_winner.time))}</div>
                    <div className="fs-20 text-white log-title">Progressive Weekly Winner</div>
                    <div className="ticket-id-array">
                      {Number(weekly_winner.ticketID) > 0 && (
                        weekly_ticketID.map((item, index) => (
                          <div key={index} className={index % 2 === 0 ? "ticket_item" : "ticket_item dark"} >{item}</div>
                        ))
                      )}
                    </div>
                    {weekly_winner.addr === "0" ? (
                      <div className="no_ticket">No chosen</div>
                    ) : (
                      <div className="fs-18 text-white">{this.resetWalletAddress(weekly_winner.addr)}</div>
                    )}
                  </div>
                </Reveal>
              </div>
              <div className="col-md-5 col-sm-6">
                <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={800} triggerOnce>
                  <div className="msg-content-item gap-10">
                    {isNewTime(Number(bi_daily_winner.time)) && (
                      <div className="new-icon">NEW</div>
                    )}
                    <div className="msg-date">{getStringDate(Number(bi_daily_winner.time))}</div>
                    <div className="fs-20 text-white log-title">48 Hour Drawings Winner</div>
                    <div className="ticket-id-array">
                      {Number(bi_daily_winner.ticketID) > 0 && (
                        bi_daily_ticketID.map((item, index) => (
                          <div key={index} className={index % 2 === 0 ? "ticket_item" : "ticket_item dark"} >{item}</div>
                        ))
                      )}
                    </div>
                    {bi_daily_winner.addr === "0" ? (
                      <div className="no_ticket">No chosen</div>
                    ) : (
                      <div className="fs-18 text-white">{this.resetWalletAddress(bi_daily_winner.addr)}</div>
                    )}
                  </div>
                </Reveal>
              </div>
              <div className="col-md-12">
                <h1 className="xs-hide" style={{ color: 'rgba(255, 255, 255, 0.2)' }} align={'center'}>CONGRATULATIONS!</h1>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
};

export default LotteryWinner;