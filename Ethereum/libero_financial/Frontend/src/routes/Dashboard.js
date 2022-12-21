import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from '@reach/router';
import { useSelector } from 'react-redux';
import { Reveal } from 'react-awesome-reveal';
import { createGlobalStyle } from 'styled-components';
import Rechart from '../components/Dashboard/Rechart';
import RebaseBar from '../components/Dashboard/RebaseBar';
import * as selectors from '../store/selectors';
import { fadeInUp, getUTCNow, numberWithCommas, LoadingSkeleton, sec2str } from '../components/utils';
import { getMarketCap, getTotalEarned } from '../core/web3';
import { getUserClaimTimes, getClaimPeriod } from '../core/Dashboard';
import { getTokenHolders, getAstroPrice } from '../core/axios';
import { config, def_config } from '../core/config';

const GlobalStyles = createGlobalStyle`
  .dashboard-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    background-size: cover !important;
    background-position-x: center !important;
    padding: 20px;
    @media only screen and (max-width: 1200px) {
      .col {
        width: 100%;
      }
    }
  }

  .dashboard-title {
    width: fit-content;
    text-overflow: ellipsis;
    white-space: nowrap;
    h3 {
      line-height: 2rem;
    }
  }

  .community-perform {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .calc-card {
    padding: 10px 20px;
    text-align: left;
  }

  .claim-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    p {
      margin: 1px;
      color: rgb(188 195 207);
    }
    .sub-title {
      width: 100%;
      text-align: left;
      color: white;
    }
  }

  .rebase-card {
    padding: 30px 60px;
    @media only screen and (max-width: 1500px) and (min-width: 1200px) {
      padding: 30px 30px;
    }
    @media only screen and (max-width: 768px) {
      padding: 10px;
    }
  }

  .progress-content {
    @media only screen and (max-width: 768px) {
      width: 80% !important;
    }
  }

  .astro-text {
    color: rgb(255, 184, 77) !important;
    font-weight: bold;
    font-size: 24px;
  }

  .rebase-text {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    @media only screen and (min-width: 769px) {
      height: 100%;
    }
  }

  .claim-value {
    color: #4ed047 !important;
    font-size: 22px;
  }

  .MuiChip-label {
    font-family: "CenturyGothic";
    font-size: 16px;
    letter-spacing: 1px;
  }
  .btn-claim {
    width: calc(100% - 50px);
    justify-content: center;
    margin-left: 25px;
    margin-right: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    @media only screen and (max-width: 1400px) and (min-width: 1200px) {
      flex-direction: column;
      padding: 14px 5px;
    }
    @media only screen and (max-width: 768px) {
      width: calc(100% - 10px);
      margin-left: 5px;
      margin-right: 5px;
    }
    span {
      white-space: nowrap;
    }
  }

  .rebase-bar {
    width: 38%;
    @media only screen and (max-width: 768px) {
      width: 100%;
    }
  }

  .rebase-body {
    width: 62%;
    @media only screen and (max-width: 768px) {
      width: 100%;
    }
  }
`;

const Dashboard = (props) => {
  const APY = def_config.APY;
  const dailyRate = def_config.DPR;
  const rebaseRate = def_config.REBASE_RATE;
  const defPrice = def_config.DEF_PRICE;
  const balance = useSelector(selectors.userBalance);
  const wallet = useSelector(selectors.userWallet);
  const web3 = useSelector(selectors.web3State);
  const [dailyAstro, setDailyAstro] = useState('');
  const [nextRebaseAmount, setNextRebaseAmount] = useState('');
  const [astroPrice, setAstroPrice] = useState('');
  const [pricePercent, setPricePercent] = useState('');
  const [marketCap, setMarketCap] = useState('');
  // const [claimAstro, setClaimAstro] = useState('');
  const [tokenHolders, setTokenHolders] = useState('');
  const [totalEarned, setTotalEarned] = useState('');
  const [earnedRate, setEarnedRate] = useState('');
  const [nextClaimTime, setNextClaimTime] = useState(0);
  const [remainTime, setRemainTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const initialize = useCallback(async () => {
    console.log('[Wallet] = ', wallet);
    if (!web3) {
      return;
    }
    setLoading(true);
    let nowAstroPrice = 0;
    let oneWeek = 0;
    let result = await getAstroPrice();
    if (result.success) {
      nowAstroPrice = result.astroPrice;
      setAstroPrice(result.astroPrice);
      const percent = (Number(nowAstroPrice) - defPrice) / defPrice * 100;
      setPricePercent(percent);
    }
    result = await getTokenHolders();
    if (result.success) {
      setTokenHolders(result.count);
    }
    result = await getMarketCap(nowAstroPrice);
    if (result.success) {
      setMarketCap(result.marketCap);
    }
    result = await getTotalEarned();
    if (result.success) {
      setTotalEarned(result.total_earned);
      setEarnedRate(result.earned_rate);
    }
    result = await getClaimPeriod();
    if (result.success) {
      oneWeek = result.oneWeek;
    }
    result = await getUserClaimTimes();
    if (result.success) {
      let claimTime = Math.floor(Number(result.claimTime) + Number(oneWeek) - getUTCNow() / 1000);
      if (claimTime <= 0) {
        claimTime = 0;
      }
      setNextClaimTime(claimTime);
    }

    let amount = Number(balance.astroBalance) * rebaseRate;
    setNextRebaseAmount(amount);
    // amount = Number(balance.astroBalance) * 0.01;
    // setClaimAstro(amount);
    setDailyAstro(Number(balance.astroBalance) * dailyRate);

    setLoading(false);
  }, [wallet, web3, balance.astroBalance, rebaseRate, dailyRate, defPrice]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (nextClaimTime > 0) {
      setRemainTime(nextClaimTime);
    }
  }, [nextClaimTime]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (remainTime <= 0) setRemainTime(0);
      else setRemainTime(remainTime - 1);
    }, 1000);
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  });

  return (
    <div className='page-container dashboard-container'>
      <GlobalStyles />
      <div className='row full-width'>
        <div className='col-md-12'>
          <Reveal keyframes={fadeInUp} className='onStep' delay={0} duration={800} triggerOnce>
            <div className='dashboard-title'>
              <span className='fs-18 f-century fw-bold ls-1 mb-2 ms-4'>COMMUNITY PERFORMANCE</span>
            </div>
          </Reveal>
        </div>
        <div className='col-md-12'>
          <Reveal keyframes={fadeInUp} className='onStep' delay={0} duration={800} triggerOnce>
            <div className='full-card'>
              <div className='row row-gap-1'>
                <div className='col-xl-6 col-lg-12'>
                  <div className='row h-100 justify-between row-gap-1'>
                    <div className='col-md-6'>
                      <div className='main-card'>
                        <div className='flex justify-between'>
                          <p className='fs-16'>ASTRO Price</p>
                          <p className={Number(pricePercent) >= 0 ? "card-chip fs-12 up" : "card-chip fs-12 down"}>{loading ? <LoadingSkeleton width={45}/> : `${Number(pricePercent) >= 0 ? '+' : '-' + Number(Math.abs(pricePercent)).toFixed(2) + '%'}`}</p>
                        </div>
                        <p className='card-value mt-3 mb-3'>{loading || astroPrice === '' ? <LoadingSkeleton /> : '$' + numberWithCommas(astroPrice, 4)}</p>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='main-card'>
                        <p className='fs-16'>Market Cap</p>
                        <p className='card-value bold text-white mt-3 mb-3'>{loading || marketCap === '' ? <LoadingSkeleton /> : '$' + numberWithCommas(marketCap)}</p>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='main-card'>
                        <p className='fs-16'>APY</p>
                        <p className='card-value text-white'>{numberWithCommas(APY * 100)}%</p>
                        <p className='card-value type-3'>Daily % Rate (DPR): ~{numberWithCommas(dailyRate * 100)}%</p>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='main-card'>
                        <p className='fs-16'>Total Holders</p>
                        <p className='card-value text-white mt-3 mb-3'>{loading || tokenHolders === '' ? <LoadingSkeleton /> : numberWithCommas(tokenHolders)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-6 col-lg-12'>
                  <div className='main-card rebase-card'>
                    <div className='row full-height'>
                      <div className='d-flex rebase-bar'>
                        <RebaseBar center={true} />
                      </div>
                      <div className='full-height rebase-body'>
                        <div className='rebase-text'>
                          <div className='flex flex-column'>
                            <p className="text-center f-century fs-16">NEXT REBASE AMOUNT</p>
                            <p className='text-center fs-26 fw-bold mb-0'>{loading || nextRebaseAmount === '' || astroPrice === '' ? <LoadingSkeleton /> : '$' + numberWithCommas(nextRebaseAmount * astroPrice)}</p>
                            <p className='text-center fs-12 text-gray mb-0'>{loading || nextRebaseAmount === '' ? <LoadingSkeleton /> : numberWithCommas(nextRebaseAmount) + ' ASTRO'}</p>
                          </div>
                          {remainTime <= 0 ? (
                            <button className='d-flex btn-main btn-claim fs-16' onClick={() => navigate('/account')}>
                              <span>Weekly Claim (1%)</span>
                              {/* <span>&nbsp;&nbsp; {loading ? <LoadingSkeleton width={50} /> : '($' + numberWithCommas(claimAstro * astroPrice) + ')'}</span> */}
                            </button>
                          ) : (
                            <button className='d-flex btn-main btn-claim fs-16' disabled>You can Claim again in {sec2str(remainTime)}</button>
                          )}
                          <p className='fs-14 text-center'>If you choose to take your weekly claim, click below for 1% to maximize your growth.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        <div className='col-md-12 mt-4'>
          <Reveal keyframes={fadeInUp} className='onStep' delay={300} duration={800} triggerOnce>
            <div className='dashboard-title'>
              <span className='fs-18 f-century fw-bold ls-1 mb-2 ms-4'>YOUR ACTIVITY</span>
            </div>
          </Reveal>
        </div>
        <div className='col-md-12'>
          <Reveal keyframes={fadeInUp} className='onStep' delay={300} duration={800} triggerOnce>
            <div className='full-card'>
              <div className='row row-gap-1'>
                <div className='col-xl-6 col-lg-12 align-items-stretch'>
                  <div className='row h-100 justify-between row-gap-1'>
                    <div className='col-md-6'>
                      <div className='main-card'>
                        <p className='fs-16'>Your Earnings / Daily</p>
                        <p className='card-value bold fs-40'>{loading || dailyAstro === '' || astroPrice === '' ? <LoadingSkeleton /> : `$${numberWithCommas(dailyAstro * astroPrice)}`}</p>
                        <p className='card-value type-3'>{loading || dailyAstro === '' ? <LoadingSkeleton /> : `${numberWithCommas(dailyAstro)} ASTRO`}</p>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='main-card'>
                        <p className='fs-16'>APY</p>
                        <p className='card-value text-white'>{numberWithCommas(APY * 100)}%</p>
                        <p className='card-value type-3'>Daily % Rate (DPR): ~{numberWithCommas(dailyRate * 100)}%</p>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='main-card'>
                        <div className='flex justify-between'>
                          <p className='fs-16'>Total Earned</p>
                          <p className={earnedRate >= 0 ? "card-chip up" : "card-chip down"}>{loading ? '' : `${earnedRate >= 0 ? '+' : '-'}${numberWithCommas(Math.abs(earnedRate))}`}%</p>
                        </div>
                        <p className={'card-value'}>{loading ? <LoadingSkeleton /> : `$${numberWithCommas(Number(Math.abs(totalEarned)) * astroPrice)}`}</p>
                        <p className={'card-value type-3'}>{loading ? <LoadingSkeleton /> : `${numberWithCommas(Number(Math.abs(totalEarned)))} ASTRO`}</p>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='main-card'>
                        <p className='fs-16'>Your Balance</p>
                        <p className='card-value'>{loading ? <LoadingSkeleton /> : `$${numberWithCommas(Number(balance.astroBalance) * astroPrice)}`}</p>
                        <p className='card-value type-3'>{loading ? <LoadingSkeleton /> : `${numberWithCommas(Number(balance.astroBalance))} ASTRO`}</p>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <a href={`https://dexscreener.com/avalanche/${config.avaxAstroPair}`} className='btn-main btn5 full-width fs-16' target='_blank' rel="noreferrer">DEX Charts</a>
                    </div>
                    <div className='col-md-6'>
                      <button className='btn-main full-width fs-16' onClick={() => navigate('/swap')}>Buy ASTRO</button>
                    </div>
                  </div>
                </div>
                <div className='col-xl-6 col-lg-12 align-items-stretch'>
                  <div className='main-card'>
                    <Rechart />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div >
  );
};

export default Dashboard;