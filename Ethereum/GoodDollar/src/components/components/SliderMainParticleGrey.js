import React, { useEffect, useRef } from 'react';
import Reveal from 'react-awesome-reveal';
import Slider from "react-slick";
import { keyframes } from "@emotion/react";
import $ from 'jquery';

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
const inline = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
  .d-inline{
    display: inline-block;
   }
`;

const Slidermainparticle = () => {
  const slider = useRef(null);
  
  useEffect(() => {
    $('#slider_2').hide();
    $('#slider_1').show();
  }, []);

  const beforeChange = (prev, next) => {
    const prevSlideElement = slider.current.innerSlider.list.querySelector(`[data-index="${prev}"]`);
    const nextSlideElement = slider.current.innerSlider.list.querySelector(`[data-index="${next}"]`);
    
    if (prev === 0) {
      $('#slider_1').hide();
      $('#slider_2').show();
    } else {
      $('#slider_2').hide();
      $('#slider_1').show();
    }

    setTimeout(() => {
      prevSlideElement.classList.remove('next-slide-anim');
      nextSlideElement.classList.add('next-slide-anim');
    });
  }

  const settings = {
    infinite: true,
    speed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    adaptiveHeight: 300,
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 8000,
    fade: true,
    swipeToSlide: true,
    swipe: true,
    draggable: false,
    touchMove: false,
    beforeChange,
  }

  return (
  <div className="container">
    <Slider {...settings} ref={slider}>
      <div id='slider_1' className='itm' index={1} key={0}>
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="spacer-single"></div>
            <h6> <span className="text-uppercase color">&nbsp;</span></h6>
            <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={900} triggerOnce={true}>
              <h1 className="col-white">Anyone can create a TweetStorm</h1>
            </Reveal>
            <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={900} triggerOnce={true}>
              <p className="lead col-white">
                G$ is used to incentivize participation in social media.<br />
                Anyone that wants to promote a tweet and create a TweetStorm can do so in sybil resistant way and with G$.
              </p>
            </Reveal>
            <div className="spacer-10"></div>
            <Reveal className='onStep d-inline' keyframes={inline} delay={800} duration={900} triggerOnce={true}>
              <span id="create_btn" onClick={() => window.open("/create", "_self")} className="btn-main inline lead">Create a TweetStorm</span>
              <div className="mb-sm-30"></div>
            </Reveal>

            {/* <Reveal className='onStep d-inline' keyframes={inline} delay={900} duration={1200} triggerOnce={true}>
              <div className="row">
                <div className="spacer-single"></div>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="de_count text-left">
                      <h5><span>Total Count of TweetStorm</span></h5>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="de_count text-left">
                      <h3 className="id-color mb-0">7,220</h3>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="de_count text-left">
                      <h5><span>Total Rewarded Amount</span></h5>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="de_count text-left">
                      <h3 className="id-color mb-0">G$ 507,200</h3>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 mb30">
                    <div className="de_count text-left">
                      <h5><span>Total Created Amount</span></h5>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 mb30">
                    <div className="de_count text-left">
                      <h3 className="id-color mb-0">G$ 158,500</h3>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal> */}
          </div>
          <div className="col-md-6">
            <Reveal className='onStep d-inline' keyframes={inline} delay={300} duration={1200} triggerOnce={true}>
              <img src="./img/person2.png" className="lazy img-fluid" alt="" />
            </Reveal>
          </div>
        </div>
      </div>
      <div id='slider_2' className='itm' index={2} key={1}>
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="spacer-single"></div>
            <h6> <span className="text-uppercase color">&nbsp;</span></h6>
            <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={900} triggerOnce={true}>
              <h1 className="col-white">Earn GoodDollars For promoting tweets</h1>
            </Reveal>
            <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={900} triggerOnce={true}>
              <p className="lead col-white">
                You can receive rewards (G$) just by viewing the Twitter articles assigned to the TweetStorm.<br />
                &nbsp;
              </p>
            </Reveal>
            <div className="spacer-10"></div>
            <Reveal className='onStep d-inline' keyframes={inline} delay={800} duration={900} triggerOnce={true}>
              <span id="join_btn" onClick={() => window.open("/explorer", "_self")} className="btn-main inline lead">Join a TweetStorm</span>
              <div className="mb-sm-30"></div>
            </Reveal>

            {/* <Reveal className='onStep d-inline' keyframes={inline} delay={900} duration={1200} triggerOnce={true}>
              <div className="row">
                <div className="spacer-single"></div>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="de_count text-left">
                      <h5><span>Total Count of TweetStorm</span></h5>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="de_count text-left">
                      <h3 className="id-color mb-0">7,220</h3>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="de_count text-left">
                      <h5><span>Total Rewarded Amount</span></h5>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="de_count text-left">
                      <h3 className="id-color mb-0">G$ 507,200</h3>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 mb30">
                    <div className="de_count text-left">
                      <h5><span>Total Created Amount</span></h5>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 mb30">
                    <div className="de_count text-left">
                      <h3 className="id-color mb-0">G$ 158,500</h3>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal> */}
          </div>
          <div className="col-md-6">
            <Reveal className='onStep d-inline' keyframes={inline} delay={300} duration={1200} triggerOnce={true}>
              <img src="./img/person1.png" className="lazy img-fluid" alt="" />
            </Reveal>
          </div>
        </div>
      </div>
    </Slider>
  </div >
)};
export default Slidermainparticle;