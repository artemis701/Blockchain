import React from 'react';
import Reveal from 'react-awesome-reveal';
import { useScrollSection } from "react-scroll-section";
import { keyframes } from "@emotion/react";

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
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Slidermain = () => {
  const buySection = useScrollSection('mint-nft-section');
  return (
    <>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-12 text-center">
            <div className="spacer-single"></div>
            <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
              <h1 className=""><span className="text-uppercase text-white">SCOPE SOCIAL FINANCE</span></h1>
            </Reveal>
            <div className="spacer-10"></div>
            <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
              <h3 className="">Pre-sale For ZKEY</h3>
            </Reveal>
            <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
              <h4 className="" style={{color: '#e47878'}}>Don't miss the opportunity.</h4>
            </Reveal>
            <div className="spacer-10"></div>
            <Reveal className='onStep' keyframes={fadeInUp} delay={900} duration={900} triggerOnce>
              <span onClick={buySection.onClick} selected={buySection.selected} className="btn-main lead round-button m-auto mb-3">BUY ZKEY</span>
              <div className="mb-sm-30"></div>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  )
};
export default Slidermain;