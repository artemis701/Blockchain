import React, { useEffect, useState } from "react";
import useAsyncEffect from "use-async-effect";
import { connect } from 'react-redux';
import { compose } from 'redux';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import cx from "classnames";
import styled from "styled-components";
import Collapse from "@kunukn/react-collapse";
import Backdrop from '@mui/material/Backdrop';
import ReactLoading from "react-loading";
import {
  getWeeklyTicketPrice,
  getBiDailyTicketPrice,
  getLastWeeklyLotteryId,
  getLastDailyLotteryId,
  getLotteryRemainTime,
  buyTicket,
} from "../../core/web3";
import { fromWei, Toast, getDate } from "../../utils";
import { fetchLotteryTicket } from "../../core/graphql";
import NftModal from "./NftModal";
import Clock from "./Clock";
import './style/detail.scss'

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

const Loading = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;
`;

export const Prop = styled('h3')`f5 f4-ns mb0 white`;

const MintHeader = ({ walletState, refreshState }) => {
  const [weeklyPrice, setWeeklyPrice] = useState(0);
  const [biDailyPrice, setBiDailyPrice] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [isOpen1, setOpen1] = useState(false);
  const [isOpen2, setOpen2] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weeklyDeadline, setWeeklyDeadline] = useState(0);
  const [dailyDeadline, setDailyDeadline] = useState(0);
  const [weeklyLottoID, setWeeklyLottoID] = useState(0);
  const [dailyLottoID, setDailyLottoID] = useState(0);
  const [type, setType] = useState(0);
  const [reload, setReload] = useState(false);
  const isConnected = walletState.data ? walletState.data.isConnected : false;

  const toggle1 = index => {
    setOpen1(!isOpen1);
  };

  const toggle2 = index => {
    setOpen2(!isOpen2);
  };

  const handleModal = async (value) => {
    if (!walletState.data.isConnected) {
      Toast.fire({
        icon: 'warning',
        title: 'Please connect your walllet!'
      });
      return;
    }
    
    if ((value === 0 && weeklyDeadline <= 0) || (value === 1 && dailyDeadline <= 0)) {
      Toast.fire({
        icon: 'error',
        title: 'Lottery has been ended!'
      });
      return;
    }

    setOpenModal(true);
    setType(value);
  }

  const handleBuy = async (count) => {
    if (!walletState.data.isConnected) {
      Toast.fire({
        icon: 'warning',
        title: 'Please connect your walllet!'
      });
      return;
    }
    const balance = walletState.data ? walletState.data.balance : 0;
    const price = type === 0 ? weeklyPrice : biDailyPrice;
    const amount = Number(price) * Number(count);
    const test_amount = fromWei(amount);
    if (Number(balance) <= Number(test_amount)) {
      Toast.fire({
        icon: 'warning',
        title: 'You have insufficient AVAX. Please charge and try again!'
      });
      return;
    }
    setLoading(true);
    const result = await buyTicket(type, count, amount);
    setLoading(false);
    setOpenModal(false);
    if (result.success) {
      setReload(!reload);
      Toast.fire({
        icon: 'success',
        title: 'Purchased NFT successfully!'
      });
    } else {
      Toast.fire({
        icon: 'error',
        title: 'Something went wrong.'
      });
    }
  }

  const handleClose = () => {
    setOpenModal(false);
  }

  const loadDeadline = async () => {
    let data = await getLotteryRemainTime(0);
    if (data.success) {
      setWeeklyDeadline(Number(data.deadline));
    }
    data = await getLotteryRemainTime(1);
    if (data.success) {
      setDailyDeadline(Number(data.deadline));
    }
  }

  const loadTicketPrice = async () => {
    let data = await getWeeklyTicketPrice();
    if (data.success) {
      setWeeklyPrice(data.price);
      data = await getBiDailyTicketPrice();
      if (data.success) {
        setBiDailyPrice(data.price);
      } else {
        console.log(data.result);
      }
    } else {
      console.log(data.result);
    }
  };

  const loadWeeklyTicketData = async (weeklyParam) => {
    if (weeklyParam < 1) weeklyParam = 1;
    let result = await fetchLotteryTicket(0, weeklyParam - 1, true);
    if (result.success) {
      const data = result.data;
      const temp_weekly = [];
      let index = 0;
      data.forEach(item => {
        for (let i = 0; i < Number(item.count); i++) {
          const element = {
            no: ++index,
            date: getDate(item.time),
            ticket_no: Number(item.startNo) + i + 10000
          };
          temp_weekly.push(element);
        }
      });
      setWeeklyData(temp_weekly);
    }
  }

  const loadDailyTicketData = async (dailyParam) => {
    if (dailyParam < 1) dailyParam = 1;
    let result = await fetchLotteryTicket(1, dailyParam - 1, true);
    if (result.success) {
      const data = result.data;
      const temp_daily = [];
      let index = 0;
      data.forEach(item => {
        for (let i = 0; i < Number(item.count); i++) {
          const element = {
            no: ++index,
            date: getDate(item.time),
            ticket_no: Number(item.startNo) + i + 10000
          };
          temp_daily.push(element);
        }
      });
      setDailyData(temp_daily);
    }

  }

  const loadLottoID = async () => {
    let data = await getLastWeeklyLotteryId();
    if (data.success) {
      setWeeklyLottoID(Number(data.last_weekly_lottery_id) + 1);
    }
    data = await getLastDailyLotteryId();
    if (data.success) {
      setDailyLottoID(Number(data.last_daily_lottery_id) + 1);
    }
  }

  useAsyncEffect(async isActive => {
    await loadTicketPrice();
    if (!isActive) return;
    await loadLottoID();
    if (!isActive) return;
    await loadDeadline();
    if (!isActive) return;
  }, []);

  useEffect(() => {
    loadWeeklyTicketData(weeklyLottoID);
  }, [weeklyLottoID, reload, isConnected, refreshState])

  useEffect(() => {
    loadDailyTicketData(dailyLottoID);
  }, [dailyLottoID, reload, isConnected, refreshState])

  return (
    <>
      <NftModal
        type={type}
        open={openModal}
        handleClose={handleClose}
        handleBuy={handleBuy}
        balance={walletState.data ? walletState.data.balance : 0}
        price={type === 0 ? weeklyPrice : biDailyPrice}
      />
      <section className="container nftnav-container" style={{ background: `url('img/background/frame_6.png')` }}>
        <div className="content mx-auto">
          <div className="row m-t-60 mb-6 msg-content">
            <div className="col-md-12">
              <div className='text-center'>
                <h2 className='text-app-title'>Purchase NFT</h2>
              </div>
            </div>
            <div className="col-md-4 offset-md-2 col-sm-12">
              <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={900} triggerOnce>
                <div className="nft-content-item">
                  <div className="nft-header">
                    <span className="flex-center">Round:&nbsp; <span className="lottery-round">{weeklyLottoID}</span></span>
                    <Clock deadline={weeklyDeadline} />
                  </div>
                  <div className="nft-icon">
                    <img src="img/background/weekly_nft.png" alt=""></img>
                  </div>
                  <span className="fs-18 c-gold">{fromWei(weeklyPrice)} AVAX</span>
                  <button className="btn-main lead round-button" onClick={() => handleModal(0)}>BUY NFT</button>
                  <>
                    <button
                      className={cx("app__toggle", {
                        "app__toggle--active": isOpen1
                      })}
                      onClick={toggle1}
                    >
                      <span className="app__toggle-text c-more" align="center">{'Detail'}</span>
                      <div className="c-more">
                        {!isOpen1 ? (
                          <i className="fa fa-chevron-down"></i>
                        ) : (
                          <i className="fa fa-chevron-up"></i>
                        )}
                      </div>
                    </button>
                    <Collapse
                      isOpen={isOpen1}
                      className={
                        "app__collapse app__collapse--gradient " +
                        (isOpen1 ? "app__collapse--active" : "")
                      }
                    >
                      <div className="app__content">
                        {weeklyData.length === 0 && (
                          <div align="center">
                            You didn't buy any NFTs.
                          </div>
                        )}
                        {weeklyData.map((item, index) => (
                          <div className="history-item text-white" key={index} style={{ backgroundColor: index % 2 === 0 ? '#194068' : '#032444', fontSize: '13px' }}>
                            <div className="row">
                              <div className="col-md-3 text-center">
                                <span>{item.no}.</span>
                              </div>
                              <div className="col-md-6 text-center">
                                <span>{item.date}</span>
                              </div>
                              <div className="col-md-3 text-center">
                                <span>{item.ticket_no}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Collapse>
                  </>
                </div>
              </Reveal>
            </div>
            <div className="col-md-4 col-sm-12">
              <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={900} triggerOnce>
                <div className="nft-content-item">
                  <div className="nft-header">
                    <span className="flex-center">Round:&nbsp; <span className="lottery-round">{dailyLottoID}</span></span>
                    <Clock deadline={dailyDeadline} />
                  </div>
                  <div className="nft-icon">
                    <img src="img/background/daily_nft.png" alt=""></img>
                  </div>
                  <span className="fs-18 c-gold">{fromWei(biDailyPrice)} AVAX</span>
                  <button className="btn-main lead round-button" onClick={() => handleModal(1)}>BUY NFT</button>
                  <>
                    <button
                      className={cx("app__toggle", {
                        "app__toggle--active": isOpen2
                      })}
                      onClick={toggle2}
                    >
                      <span className="app__toggle-text c-more" align="center">{'Detail'}</span>
                      <div className="c-more">
                        {!isOpen2 ? (
                          <i className="fa fa-chevron-down"></i>
                        ) : (
                          <i className="fa fa-chevron-up"></i>
                        )}
                      </div>
                    </button>
                    <Collapse
                      isOpen={isOpen2}
                      className={
                        "app__collapse app__collapse--gradient " +
                        (isOpen2 ? "app__collapse--active" : "")
                      }
                    >
                      <div className="app__content">
                        {dailyData.length === 0 && (
                          <div align="center">
                            You didn't buy any NFTs.
                          </div>
                        )}
                        {dailyData.map((item, index) => (
                          <div className="history-item text-white" key={index} style={{ backgroundColor: index % 2 === 0 ? '#194068' : '#032444', fontSize: '13px' }}>
                            <div className="row">
                              <div className="col-md-3 text-center">
                                <span>{item.no}.</span>
                              </div>
                              <div className="col-md-6 text-center">
                                <span>{item.date}</span>
                              </div>
                              <div className="col-md-3 text-center">
                                <span>{item.ticket_no}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Collapse>
                  </>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
        {<Backdrop
          sx={{ color: '#fff', zIndex: 9999 }}
          open={loading}
        >
          <Loading>
            <ReactLoading type={'spinningBubbles'} color="#fff" />
            <Prop className="text-white">Pending...</Prop>
          </Loading>
        </Backdrop>}
      </section>
    </>
  );
};

const mapStateToProps = state => ({
  walletState: state.wallet.walletState,
  refreshState: state.wallet.refreshState
});

const mapDispatchToProps = () => ({});

export default compose(connect(
  mapStateToProps,
  mapDispatchToProps()
))(MintHeader);