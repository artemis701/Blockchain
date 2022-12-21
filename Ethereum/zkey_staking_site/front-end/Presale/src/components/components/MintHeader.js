import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { compose } from 'redux';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import styled from "styled-components";
import Backdrop from '@mui/material/Backdrop';
import ReactLoading from "react-loading";
import { getZKEYprice, buyZkeyTokens } from "../../core/web3";
import { fromWei, toWei, Toast } from "../../utils";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import './style/detail.scss'

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

const CustomInput = styled.input`
  height: 40px;
  padding: 10px;
  padding-left: 25px;
  border: solid 1px #78e3b3;
  border-radius: 15px;
  &:focus-visible: {
    border: none;
  }
`;

const Loading = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;
`;

export const Prop = styled('h3')`f5 f4-ns mb0 white`;
const rx_live = /^[+-]?\d*?$/;

const MintHeader = ({ walletState }) => {
  const [loading, setLoading] = useState(false);
  const [tokenPrice, setTokenPrice] = useState('');
  const [tokenAmount, setTokenAmount] = useState(0);
  const [bnbPrice, setBnbPrice] = useState(0);
  const handleAmount = (event) => {
    if (rx_live.test(event.target.value)) {
      setTokenAmount(event.target.value);
      const value = event.target.value * tokenPrice;
      console.log(value);
      setBnbPrice(value);
    }
  }

  const handleBuy = async () => {
    if (!walletState.data.isConnected) {
      Toast.fire({
        icon: 'warning',
        title: 'Please connect your walllet!'
      });
      return;
    }
    const balance = walletState.data ? walletState.data.balance : 0;
    if (Number(balance) <= Number(bnbPrice)) {
      Toast.fire({
        icon: 'warning',
        title: 'You have insufficient BNB. Please charge and try again!'
      });
      return;
    }
    const result = await buyZkeyTokens(tokenAmount, bnbPrice);
    if (result.success) {
      Toast.fire({
        icon: 'success',
        title: 'Bought ZKEY successfully!'
      });
      setTokenAmount(0);
      setBnbPrice(0);
    } else {
      Toast.fire({
        icon: 'error',
        title: 'Something went wrong.'
      });
    }
  }

  useEffect(() => {
    const loadTokenPrice = async () => {
      const result = await getZKEYprice();
      if (result.success) {
        setTokenPrice(fromWei(result.price));
      }
    }
    loadTokenPrice();
  }, []);
  return (
    <>
      <section className="container nftnav-container" style={{ background: `url('img/background/frame_6.png')` }}>
        <div className="content mx-auto">
          <div className="row m-t-60 mb-6 msg-content">
            <div className="col-md-12">
              <div className='text-center'>
                <h2 className='text-app-title'>BUY ZKEY</h2>
              </div>
            </div>
            <div className="col-md-12 col-sm-12">
              <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={900} triggerOnce>
                <div className="nft-content-item">
                  <div className="nft-icon">
                    <img src="img/background/zkey.png" alt=""></img>
                  </div>
                  <span className="fs-18 c-gold">{tokenPrice} BNB</span>
                  <span className="text-white">Please insert ZKEY amount to purchase</span>
                  <div className="input-price">
                    <img src="img/background/zkey.png" alt=""></img>
                    <CustomInput type="number" onChange={handleAmount} value={tokenAmount === 0 ? '' : tokenAmount}></CustomInput>
                  </div>
                  <span className="downward-icon"><ArrowDownwardIcon></ArrowDownwardIcon></span>
                  <div className="input-price">
                    <img src="img/background/bnb.png" alt=""></img>
                    <CustomInput type="number" readOnly value={bnbPrice === 0 ? '' : bnbPrice}></CustomInput>
                  </div>
                  <button className="btn-main lead round-button" onClick={handleBuy}>BUY</button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
        {<Backdrop
          sx={{ color: '#fff', zIndex: 9999 }}
          open={loading}
        >
          <Loading>
            <ReactLoading type={'spinningBubbles'} color="#fff" />
            <Prop className="text-white">Pending...</Prop>
          </Loading>
        </Backdrop>}
      </section>
    </>
  );
};

const mapStateToProps = state => ({
  walletState: state.wallet.walletState,
});

const mapDispatchToProps = () => ({});

export default compose(connect(
  mapStateToProps,
  mapDispatchToProps()
))(MintHeader);