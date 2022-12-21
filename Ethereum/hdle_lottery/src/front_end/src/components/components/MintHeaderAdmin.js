import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { compose } from 'redux';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import Backdrop from '@mui/material/Backdrop';
import ReactLoading from "react-loading";
import styled from "styled-components";
import { getWeeklyTicketPrice, getBiDailyTicketPrice, setWeeklyTicketPrice, setBiDailyTicketPrice, isOwner } from "../../core/web3";
import { fromWei, Toast } from "../../utils";
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

const Loading = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;
`;

export const Prop = styled('h3')`f5 f4-ns mb0 white`;

const MintHeaderAdmin = ({ walletState }) => {
  const [weeklyPrice, setWeeklyPrice] = useState(0);
  const [defWeeklyPrice, setDefWeeklyPrice] = useState(0);
  const [biDailyPrice, setBiDailyPrice] = useState(0);
  const [defBiDailyPrice, setDefBiDailyPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSetPrice = async (nft_type) => {
    if (await checkOwner() === false) {
      return;
    }
    setLoading(true);
    if (nft_type === 0) {
      const result = await setWeeklyTicketPrice(weeklyPrice);
      setLoading(false);
      if (result.success) {
        Toast.fire({
          icon: 'success',
          title: `Updated price successfully!`
        });
      } else {
        console.log('[Error]=', result.status);
        Toast.fire({
          icon: 'success',
          title: `Updated price successfully!`
        });
      }
    } else {
      const result = await setBiDailyTicketPrice(biDailyPrice);
      setLoading(false);
      if (result.success) {
        Toast.fire({
          icon: 'success',
          title: `Updated price successfully!`
        });
      } else {
        console.log('[Error]=', result.status);
        Toast.fire({
          icon: 'success',
          title: `Updated price successfully!`
        });
      }
    }
    await loadTicketPrice();
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "weekly_price") {
      setWeeklyPrice(value);
    } else if (name === "daily_price") {
      setBiDailyPrice(value);
    }
  }

  const loadTicketPrice = async () => {
    let data = await getWeeklyTicketPrice();
    if (data.success) {
      setDefWeeklyPrice(fromWei(data.price));
      data = await getBiDailyTicketPrice();
      if (data.success) {
        setDefBiDailyPrice(fromWei(data.price));
      } else {
        console.log(data.result);
      }
    } else {
      console.log(data.result);
    }
  };

  const checkOwner = async () => {
    const result = await isOwner();
    if (!result) {
      Toast.fire({
        icon: 'error',
        title: `You aren't a owner.`
      });
      return false;
    }
    return true;
  }

  useEffect(() => {
    checkOwner();
    loadTicketPrice();
  }, []);

  return (
    <>
      <section className="container nftnav-container" style={{ background: `url('img/background/frame_6.png')` }}>
        <div className="content mx-auto">
          <div className="row m-t-60 mb-6 msg-content">
            <div className="col-md-12">
              <div className='text-center'>
                <h2 style={{ color: '#f91c4c' }}>Only Owner can change all data.</h2>
              </div>
            </div>
            <div className="col-md-12">
              <div className='text-center'>
                <h2>Current NFT Tickets</h2>
              </div>
            </div>
            <div className="col-md-4 offset-md-2 col-sm-12">
              <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={900} triggerOnce>
                <div className="nft-content-item">
                  <div className="nft-icon">
                    <img src="img/background/weekly_nft.png" alt=""></img>
                  </div>
                  <span className={Number(weeklyPrice) > 0 ? "fs-18 c-more text-line" : "fs-18 c-more"}>{defWeeklyPrice} AVAX</span>
                  {Number(weeklyPrice) > 0 && (
                    <span className="fs-18 c-red">{weeklyPrice} AVAX</span>
                  )}
                  <div className="nft-change-price">
                    <input type="number" name="weekly_price" className="change_price mb-2" onChange={handleChange}></input>
                    <button className="btn-main lead round-button mb-2" onClick={() => handleSetPrice(0)}>CHANGE PRICE</button>
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="col-md-4 col-sm-12">
              <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={900} triggerOnce>
                <div className="nft-content-item">
                  <div className="nft-icon">
                    <img src="img/background/daily_nft.png" alt=""></img>
                  </div>
                  <span className={Number(biDailyPrice) > 0 ? "fs-18 c-more text-line" : "fs-18 c-more"}>{defBiDailyPrice} AVAX</span>
                  {Number(biDailyPrice) > 0 && (
                    <span className="fs-18 c-red">{biDailyPrice} AVAX</span>
                  )}
                  <div className="nft-change-price">
                    <input type="number" name="daily_price" className="change_price mb-2" onChange={handleChange}></input>
                    <button className="btn-main lead round-button mb-2" onClick={() => handleSetPrice(1)}>CHANGE PRICE</button>
                  </div>
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
))(MintHeaderAdmin);