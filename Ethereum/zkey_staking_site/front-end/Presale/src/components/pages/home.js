import React, { useEffect, useState } from 'react';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import {
  ScrollingProvider,
  Section,
} from "react-scroll-section";
import SliderMain from '../components/SliderMain';
import Footer from '../components/footer';
import { checkNetwork } from '../../core/web3';
import Header from '../menu/header';
import MintHeader from '../components/MintHeader';
import Roadmap from '../components/Roadmap';

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
  useEffect(() => {
    async function checkNetworkChain() {
      window.web3.eth.getChainId().then(async (chainId) => {
        checkNetwork(chainId);
      })
    }
    checkNetworkChain();
  }, []);

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <div>
      <ScrollingProvider scrollBehavior="smooth">
        <Header />
        <Section id="dashnav-section" className="jumbotron breadcumb no-bg h-vh" style={{ backgroundImage: "url('/img/background/frame_1.png')", marginTop: '85px' }}>
          <SliderMain />
        </Section>

        <Section id="mission-section" className='no-bottom'>
          <div className='container'>
            <div className='row'>
              <div className='col-lg-12'>
                <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={1000} triggerOnce>
                  <div className='text-center'>
                    <h2 className='text-app-title'>PRESALE FOR ZKEY</h2>
                  </div>
                </Reveal>
              </div>
              <div className='col-lg-12'>
                <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={1000} triggerOnce>
                  <div className="mission-content">
                    <span>
                      We are moving a step forward to success, finally governor token of Scope Social Finance has been deployed which gives monthly 10% income for life-time staking, plus you could have chance to farm it with EJOY or SCP, we also want to welcome other projects farm with us.. Please buy gonvernor token of Scope Social Finance - ZKEY.
                      This site is pre-sale site for ZKEY. <br/>
                      Don't miss the opportunity.
                      ZKEY price will be 0.01 USD soon.
                    </span>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </Section>

        <Section id="mint-nft-section" className='no-bottom full-container'>
          <MintHeader />
        </Section>
        <Footer />
      </ScrollingProvider>
    </div>
  )
};
export default Home;