import React from "react";
import { connect } from 'react-redux';
import { compose } from 'redux';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import { numberWithCommas } from "../../utils";
import {
  getMarketCap,
  getTotalInvestment,
  getLotteryStatus,
  getLastWeeklyLotteryId,
  getLastDailyLotteryId
} from "../../core/web3";
import { fromWei } from "../../utils";
import { fetchLotteryTicket, getTopWinner } from "../../core/graphql";

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

class DashHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      market_cap: 0,
      last_weekly: 0,
      last_daily: 0
    }
  }

  async componentDidMount() {
    await this.load_contract_content();
  }

  load_contract_content = async () => {
    let market_cap = 0, last_weekly_price = 0, last_daily_price = 0;
    let data = await getMarketCap();
    if (data.success) {
      market_cap = fromWei(data.marketcap);
    } else {
      console.log(data.result);
      return;
    }
    data = await getTopWinner(0);
    if (data.success && data.selectWinners.length > 0) {
      last_weekly_price = fromWei(data.selectWinners[0].price);
    }

    data = await getTopWinner(1);
    if (data.success && data.selectWinners.length > 0) {
      last_daily_price = fromWei(data.selectWinners[0].price);
    }
    this.setState({ market_cap, last_weekly_price, last_daily_price });
  }

  render() {
    return (
      <>
        <section className="container msg-container">
          <div className="content mx-auto">
            <div className="row m-t-60 mb-6 msg-content">
              <div className='col-lg-12'>
                <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
                <div className='text-center'>
                  <h2 className="text-app-title">Statistics</h2>
                </div>
                </Reveal>
              </div>
              <div className="col-md-4 col-sm-6">
                <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
                  <div className="msg-content-item">
                    <div className="item-icon icon1 mb-4">
                      <img src="img/background/icon_1.png" alt=""></img>
                    </div>
                    <div className="fs-18 text-white text-center mb-3">TOTAL PAYOUT</div>
                    <div className="fs-20 text-white">{numberWithCommas(this.state.market_cap)} AVAX</div>
                  </div>
                </Reveal>
              </div>
              <div className="col-md-4 col-sm-6">
                <Reveal className='onStep' keyframes={fadeInUp} delay={400} duration={600} triggerOnce>
                  <div className="msg-content-item">
                    <div className="item-icon icon2 mb-4">
                      <img src="img/background/icon_2.png" alt=""></img>
                    </div>
                    <div className="fs-18 text-white text-center mb-3">LAST WEEKLY PAYOUT</div>
                    <div className="fs-20 text-white">{(this.state.last_weekly_price)} AVAX</div>
                  </div>
                </Reveal>
              </div>
              <div className="col-md-4 col-sm-6">
                <Reveal className='onStep' keyframes={fadeInUp} delay={400} duration={600} triggerOnce>
                  <div className="msg-content-item">
                    <div className="item-icon icon3 mb-4">
                      <img src="img/background/icon_3.png" alt=""></img>
                    </div>
                    <div className="fs-18 text-white text-center mb-3">LAST 48 HRS PAYOUT</div>
                    <div className="fs-20 text-white">{(this.state.last_daily_price)} AVAX</div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
};

const mapStateToProps = state => ({
  walletState: state.wallet.walletState,
  refreshState: state.wallet.refreshState
});

const mapDispatchToProps = () => ({});

export default compose(connect(
  mapStateToProps,
  mapDispatchToProps()
))(DashHeader);