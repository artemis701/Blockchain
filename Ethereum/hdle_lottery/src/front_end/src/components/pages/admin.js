import React, { useEffect, useState } from 'react';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import Footer from '../components/footer';
import MintHeaderAdmin from '../components/MintHeaderAdmin';
import ControlData from '../components/ControlData';
import { getLastWeeklyLotteryId, getLastDailyLotteryId } from '../../core/web3';
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

const Mint = () => {
  const [lastWeekLotteryID, setLastWeekLotteryID] = useState(0);
  const [lastDailyLotteryID, setLastDailyLotteryID] = useState(0);
  
  const loadLotteryID = async () => {
    let result = await getLastWeeklyLotteryId();
    setLastWeekLotteryID(Number(result.last_weekly_lottery_id));
    result = await getLastDailyLotteryId();
    setLastDailyLotteryID(Number(result.last_daily_lottery_id));
  }
  useEffect(() => {
    loadLotteryID();
  }, []);
  return (
  <div>
    <section className="container dashnav-container" style={{ marginTop: '85px' }}>
      <MintHeaderAdmin />
    </section>
    <section className="nft-container">
      <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={900} triggerOnce>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='text-center'>
              <h2>Change Lottery Informations.</h2>
            </div>
          </div>
        </div>
        <ControlData weeklyID={lastWeekLotteryID} dailyID={lastDailyLotteryID} />
      </Reveal>
    </section>
    <Footer />
  </div>
)};
export default Mint;