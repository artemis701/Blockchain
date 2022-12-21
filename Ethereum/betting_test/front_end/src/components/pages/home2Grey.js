import React from 'react';
import Footer from '../components/footer';
import Betting from '../components/Betting';
import './style/home.scss';

const homeone = () => (
  <div className="greyscheme">
    <section className="jumbotron no-bg relative">
      <img className="circle_up1" src="/img/circle.png" alt=""></img>
      <img className="circle_right" src="/img/circle.png" alt=""></img>
      <h2>Betting Test</h2>
    </section>
    <section className='container no-bottom'>
      <Betting />
    </section>
    <Footer />
  </div>
);
export default homeone;