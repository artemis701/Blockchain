import React, { useEffect, useState } from 'react';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import {
  ScrollingProvider,
  Section,
} from "react-scroll-section";
import DashHeader from '../components/DashHeader';
import SliderMain from '../components/SliderMain';
import FeatureBox from '../components/FeatureBox';
import FAQBox from '../components/FAQBox';
import Footer from '../components/footer';
import Congratulation from '../components/Congratulation';
import { checkNetwork } from '../../core/web3';
import { getCongratulationType } from '../../core/graphql';
import Header from '../menu/header';
import MintHeader from '../components/MintHeader';
import NftHistory from '../components/NftHistory';
import LotteryWinner from '../components/LotteryWinner';
import { getWinnerState } from '../../core/graphql';
import { validationStartTime } from '../../utils';
import { isContract } from '../../core/web3';

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

const Home = () => {
  const [open, setOpen] = useState(false);
  const [winningInfo, setWinningInfo] = useState({
    id: '',
    type: '',
    ticket_id: '',
    price: ''
  });
  const [intervalID, setIntervalID] = useState(0);
  const [pastTime, setPastTime] = useState(0);
  useEffect(() => {
    async function checkNetworkChain() {
      window.web3.eth.getChainId().then(async (chainId) => {
        checkNetwork(chainId);
      })
    }
    getLotteryState();
    const timerID = setInterval(() => getLotteryState(), 10000);
    setIntervalID(timerID);
    checkNetworkChain();
    return (() => {
      clearInterval(intervalID);
    })
  }, []);

  const getLotteryState = async () => {
    const winnerState = await getWinnerState();
    if (winnerState.length > 0) {
      const state = winnerState[0];
      const new_time = state.time;
      const pastTime = localStorage.getItem('past_time');
      if (pastTime !== new_time) {
        if (validationStartTime(new_time)) {
          setOpen(true);
          const addr = isContract(state.addr) ? 0 : state.addr;
          const info = {
            id: state.lottery_id,
            addr: addr,
            type: Number(state.lottery_type),
            ticket_id: state.ticketID,
            price: state.price
          }
          setWinningInfo(info);
        }
        localStorage.setItem('past_time', new_time);
      }
    }
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <div>
      <ScrollingProvider scrollBehavior="smooth">
        <Header />
        <Section id="dashnav-section" className="jumbotron breadcumb no-bg h-vh" style={{ marginTop: '85px' }}>
          <SliderMain />
        </Section>

        <Section id="mission-section" className='no-bottom'>
          <div className='container'>
            <div className='row'>
              <div className='col-lg-12'>
                <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={1000} triggerOnce>
                  <div className='text-center'>
                    <h2 className='text-app-title'>Mission Statement</h2>
                  </div>
                </Reveal>
              </div>
              <div className='col-lg-12'>
                <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={1000} triggerOnce>
                  <div className="mission-content">
                    <span>
                      Early adoption is interesting; it provides you the opportunity to change your life, or get left
                      behind. However, is anything ever that simple? We have been promised the world. Time and
                      time again. To only have projects overpromise and underdeliver. We here at HODL Lottery,
                      promise you nothing but a fun time and a chance for a large reward! With a limited supply and
                      daily lotteries may the odds ever be in your favor.
                    </span>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </Section>

        <Section id="purchase-section" className="container dashnav-container">
          <DashHeader />
        </Section>

        <Section id="mint-nft-section" className='no-bottom full-container'>
          <MintHeader />
        </Section>

        <Section id="my-nft-section" className="nft-container">
          <NftHistory />
        </Section>

        <Section id="how-works-section" className='no-bottom full-container'>
          <div className='row'>
            <div className='col-lg-12'>
              <div className='text-center'>
                <h2 className='text-app-title'>How it Works</h2>
              </div>
            </div>
          </div>
          <div className="works-content" style={{ backgroundImage: `url('img/background/frame_3.png')` }}></div>
          <section className='container'>
            <FeatureBox />
          </section>
        </Section>

        <Section id="last-winner-section" className='no-top no-bottom full-container'>
          <div className="winner-content" style={{ backgroundImage: `url('img/background/frame_9.png')` }}></div>
          <LotteryWinner />
        </Section>

        <Section id="faq-container" className='faq-container' style={{ backgroundImage: `url('img/background/frame_8.png')` }}>
          <div className='row'>
            <div className='col-lg-12'>
              <div className='text-center'>
                <h2 className='text-app-title'>Frequently Asked Questions</h2>
              </div>
            </div>
          </div>
          <section className="container">
            <FAQBox />
          </section>
        </Section>
        <Congratulation info={winningInfo} open={open} handleClose={handleClose} />
        <Footer />
      </ScrollingProvider>
    </div>
  )
};
export default Home;