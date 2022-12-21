import React from 'react';
import { Link } from '@reach/router';
import { createGlobalStyle } from 'styled-components';
import Reveal from 'react-awesome-reveal';
import { fadeIn, fadeInUp } from '../utils';
import LogoAnim from './LogoAnim';
// import Particles from '../components/Particles';
const GlobalStyles = createGlobalStyle`
  .header-logo {
    position: absolute;
    top: 0;
    left: 0;
    @media only screen and (max-width: 992px) {
      position: relative;
      margin-right: auto;
    }
  }
  .banner-container {
    position: relative;
    height: 800px;
    display: flex;
    align-items: center;
    @media only screen and (max-width: 992px) {
      height: 100%;
      flex-direction: column;
      gap: 30px;
    }
  }
  .banner-content {
    z-index: 999;
    @media only screen and (max-width: 992px) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  .banner-logo {
    position: absolute;
    bottom: 10px;
    right: 0;
    width: 550px;
    @media only screen and (max-width: 992px) {
      position: relative;
      width: 400px;
    }
  }
  .banner-title {
    font-family: "CenturyGothic";
    font-style: normal;
    font-weight: 700;
    font-size: 66px;
    margin-bottom: 80px;
    @media only screen and (max-width: 1200px) {
      font-size: 50px;
    }
    @media only screen and (max-width: 992px) {
      margin-bottom: 36px;
      text-align: center;
    }
  }
  .banner-subtitle {
    font-family: "CenturyGothic";
    margin-bottom: 50px;
    @media only screen and (max-width: 1200px) {
      font-size: 30px;
    }
    @media only screen and (max-width: 992px) {
      margin-bottom: 30px;
      text-align: center;
    }
  }
  .home-header-btns {
    display: flex;
    justify-content: start;
    gap: 30px;
    @media only screen and (max-width: 1024px) {
      flex-direction: column;
      align-items: center;
    }
  }
  .logo-anim {
    width: 550px;
    position: absolute;
    right: 0;
  }
  .certik-logo-box  {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    cursor: pointer;
    margin-bottom: 40px;
    @media only screen and (max-width: 768px) {
      flex-direction: column;
    }
    .certik-logo {
      border-radius: 10px;
    }
    
    .divider {
      padding-right: 10px;
      padding-left: 10px;
      display: block;
      color: #fff;
      font-weight: 400;
      @media only screen and (max-width: 768px) {
        display: none;
      }
    }
  }
`;

const slidermain = () => (
  <div className="container banner-container">
    <GlobalStyles />
    {/* <Particles /> */}
    <Link to="/" className='header-logo'>
      <img
        src="/img/logo.gif"
        className="img-fluid d-block"
        width="120px"
        alt="#"
      />
    </Link>
    <div className="banner-content">
      <h1 className="banner-title text-white">AUTOSTAKING PROTOCOL</h1>
      <h2 className="banner-subtitle">powered by the <b>100 days</b> ecosystem</h2>
      <div className='certik-logo-box'>
        <span className='flex flex-row'>Audited by <img src="/img/certik.svg" className='certik-logo mx-2' alt="" width="100px"></img> (WIP)</span>
        <span className='divider'>|</span>
        <span>Publicly DOXXED</span>
      </div>
      <div className="home-header-btns">
        <a href="https://100-days-1.gitbook.io/whitepaper/" target="_blank" rel="noreferrer" className='btn-main btn3 lead'>&nbsp;WhitePaper&nbsp;</a>
        <Link to="/astro-ico" className='btn-main btn3 lead'>Enter Presale</Link>
      </div>
    </div>
    <div className='banner-logo'>
      <LogoAnim />
    </div>
    {/* <div className="row relative" style={{ paddingTop: '64px' }}>
      <h1 className="banner-title text-white">AUTOSTAKING PROTOCOL</h1>
      <div className="col-md-7 flex flex-column justify-content-center" style={{ paddingTop: '170px', gap: '45px' }}>
        <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={600} triggerOnce>
          <div className="banner-subtitle">
            <h2 style={{ fontWeight: '500' }}>powered by the <b>100 days</b> ecosystem</h2>
          </div>
        </Reveal> */}
        {/* <div className="spacer-40"></div> */}
        {/* <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={600} triggerOnce> */}
          {/* <p className=" lead">
            Based on AVAX. Leading the evolution of DeFi through  Trust & Transparence
          </p> */}
        {/* </Reveal>
        <Reveal className='onStep' keyframes={fadeInUp} delay={900} duration={600} triggerOnce>
          <div className='certik-logo-box'>
            <span className='flex flex-row'>Audited by <img src="/img/certik.svg" className='certik-logo mx-2' alt="" width="100px"></img> (WIP)</span>
            <span className='divider'>|</span>
            <span>Publicly DOXXED</span>
          </div>
        </Reveal> */}
        {/* <div className="spacer-40"></div> */}
        {/* <Reveal className='onStep' keyframes={fadeIn} delay={1200} duration={1500} triggerOnce>
          <div className="home-header-btns">
            <a href="https://100-days-1.gitbook.io/whitepaper/" target="_blank" rel="noreferrer" className='btn-main btn3 lead'>&nbsp;WhitePaper&nbsp;</a>
            <Link to="/astro-ico" className='btn-main btn3 lead'>Enter Presale</Link>
          </div>
        </Reveal> */}
        {/* <div className="spacer-10"></div> */}
      {/* </div>
      <div className="col-md-5">
        <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={1500} triggerOnce>
          <LogoAnim />
        </Reveal>
      </div>
    </div> */}
  </div>
);
export default slidermain;