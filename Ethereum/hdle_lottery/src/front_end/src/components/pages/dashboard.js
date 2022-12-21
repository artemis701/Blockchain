import React, { useEffect, useState } from 'react';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import Footer from '../components/footer';
import DashHeader from '../components/DashHeader';
import LotteryWinner from '../components/LotteryWinner';
import Congratulation from '../components/Congratulation';
import { checkNetwork } from '../../core/web3';
import { getCongratulationType } from '../../core/graphql';

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

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);

  useEffect(() => {
    async function checkNetworkChain () {
      window.web3.eth.getChainId().then(async (chainId) => {
        if (checkNetwork(chainId)) {
          const res = await getCongratulationType();
          setOpen(res > 0 ? true : false);
          setType(res);
        }
      })
    }
    checkNetworkChain();  
  }, []);
  
  
  const handleClose = () => {
    setOpen(false);
  }
  return (
  <div>
    <section className="container dashnav-container" style={{ marginTop: '85px' }}>
      <DashHeader />
    </section>
    <section className="winner-container" style={{ background: `url('img/background/frame_4.png')` }}>
      <div className='row'>
        <div className='col-lg-12'>
          <div className='text-center'>
            <h2>Lottery Winner</h2>
          </div>
        </div>
      </div>
      <LotteryWinner />
    </section>
    <section className="container">
      <div className='row'>
        <div className='col-lg-12'>
          <div className='text-center'>
            <h2>About Us</h2>
          </div>
        </div>
        <div className='col-lg-8 offset-lg-2 col-sm-12'>
          <div className='text-center'>
            <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
              <span>
                Our community holds all the power, at least in this relationship. Truly - we are a project created
                by the people for the people. All our investments will be chosen by our fantastic community. As
                well as our future growth. Every decision we make will come via public voting held trackable
                using the blockchain. Crypto as its core was created for this purpose and we plan to uphold this
                value.
              </span>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
    <Footer />
    <Congratulation type={type} open={open} handleClose={handleClose}/>
  </div>
)};
export default Dashboard;