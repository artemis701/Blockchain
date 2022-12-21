import React from 'react';
import cx from "classnames";
import Collapse from "@kunukn/react-collapse";
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import './style/FAQ.scss'

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

const FAQContent = [
  {
    title: '1. What is HODL Lottery?',
    description: 'HODL Lottery is a lottery NFT project.'
  },
  {
    title: '2. How to buy HODL Lottery?',
    description: `You may buy our NFT's on our "Mint NFT" page.`
  },
  {
    title: '3. Why are the rewards in stable coins?',
    description: 'We believe a user should do as they wish with the funds they receive - giving rewards in stablecoins allows for consistency.'
  },
  {
    title: '4. Can I invest anywhere in the world?',
    description: 'Yes! This is the power of crypto. Our project is accessible anywhere with an internet connection!'
  },
  {
    title: '5. Why do you not have a token?',
    description: 'We believe we can function smoother and better for our users without one as it would lack true utility.'
  },
  {
    title: `6. What's unique about this project?`,
    description: `As mentioned we are by the people - for the people we truly mean this. We want to give our community the power to set the standard of a professional experience. WIth rewards carried out in stables and a large win percentage! It's all about patience.`
  },
  {
    title: '7. What will be an indicator the project is failing?',
    description: 'With the mechanicals we have set in place we do not believe this is a true risk. However through the blockchain and our dashboard the investment and rewards pool will be visible allowing our users the open opportunity for tracking.'
  }
];

const FAQBox = () => {
  return (
    <div className="faq-box">
      {
        FAQContent.map((item, index) => (
          <Reveal key={index} className='onStep' keyframes={fadeInUp} delay={100*index} duration={800} triggerOnce>
            <FAQItem title={item.title} description={item.description} />
          </Reveal>
        ))
      }
    </div>
  );
};

export default FAQBox;

const FAQItem = ({ title, description }) => {
  const [isOpen, setOpen] = React.useState(false);
  const toggle = index => {
    setOpen(!isOpen);
  };
  return (
    <>
      <button
        className={cx("app__toggle", {
          "app__toggle--active": isOpen
        })}
        onClick={toggle}
      >
        <span className="app__toggle-text text-white">{title}</span>
        <div className="text-white">
          {isOpen ? (
            <i className="fa fa-chevron-down"></i>
          ) : (
            <i className="fa fa-chevron-up"></i>
          )}
        </div>
      </button>
      <Collapse
        isOpen={isOpen}
        className={
          "app__collapse app__collapse--gradient " +
          (isOpen ? "app__collapse--active" : "")
        }
      >
        <div className="app__content">
          {description}
        </div>
      </Collapse>
    </>
  )
}