import React from 'react';
import Particle from '../components/Particle';
import SliderMainParticleGrey from '../components/SliderMainParticleGrey';
import CarouselNewRedux from '../components/CarouselNewRedux';
import AuthorListRedux from '../components/AuthorListRedux';
import Footer from '../components/footer';
import './style/home.scss';

const homeone = () => (
  <div className="greyscheme">
    <section className="jumbotron no-bg relative">
      <img className="circle_up1" src="/img/circle.png" alt=""></img>
      <img className="circle_up2" src="/img/circle.png" alt=""></img>
      <img className="circle_right" src="/img/circle.png" alt=""></img>
      <Particle />
      <SliderMainParticleGrey />
    </section>
    <section className='container no-top no-bottom'>
      <div className='row'>
        <div className="spacer-double"></div>
        <div className='col-lg-12'>
          <h2>Top Promoters</h2>
        </div>
        <div className='col-lg-12'>
          <AuthorListRedux />
        </div>
      </div>
    </section>
    <section className='container no-top'>
      <div className='row'>
        <div className="spacer-double"></div>
        <div className='col-lg-12 mb-2'>
          <h2>New TweetStorm</h2>
        </div>
      </div>
      <CarouselNewRedux />
    </section>
    <Footer />
  </div>
);
export default homeone;