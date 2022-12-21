import React from "react";
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from "styled-components";
import IconButton from '@mui/material/IconButton';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import Backdrop from '@mui/material/Backdrop';
import ReactLoading from "react-loading";
import { fetchNFThistory } from "../../core/graphql";
import { getDate, Toast, fromWei } from "../../utils";
import { givePriceToWinners } from "../../core/web3";

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

class NftHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weekly: {
        offset: 0,
        data: [],
        postData: [],
        perPage: 5,
        currentPage: 0,
        pageCount: 0
      },
      daily: {
        offset: 0,
        data: [],
        postData: [],
        perPage: 5,
        currentPage: 0,
        pageCount: 0
      },
      loading: false
    }
  }

  async componentDidMount() {
    await this.refreshPage();
  }

  componentWillUnmount() {

  }

  async componentWillReceiveProps(nextProps) {
    const { walletState } = nextProps;
    const isConnected = walletState.data ? walletState.data.isConnected : false;
    if (isConnected) {
      await this.refreshPage();
    }
  }

  refreshPage = async () => {
    await this.loadHistory();
    this.refreshData(0);
    this.refreshData(1);
  }

  loadHistory = async () => {
    const result1_data = await fetchNFThistory(0);
    const result1 = result1_data.data;
    const temp_weekly = [];
    if (result1_data.success) {
      let index = 0;
      result1.forEach(item => {
        const element = {
          no: ++index,
          date: getDate(item.time),
          lottery_id: item.lottery_id,
          lottery_type: item.lottery_type,
          amount: fromWei(item.price)
        };
        temp_weekly.push(element);
      });
    }

    const result2_data = await fetchNFThistory(1);
    const result2 = result2_data.data;
    const temp_daily = [];
    if (result2_data.success) {
      let index = 0;
      result2.forEach(item => {
        const element = {
          no: ++index,
          date: getDate(item.time),
          lottery_id: item.lottery_id,
          lottery_type: item.lottery_type,
          amount: fromWei(item.price)
        };
        temp_daily.push(element);
      });
    }

    const { weekly, daily } = this.state;
    weekly.data = temp_weekly;
    daily.data = temp_daily;
    this.setState({ weekly, daily });
  }

  refreshData = (type) => {
    // const { data } = this.state;
    if (type === 0) {
      const { weekly } = this.state;
      const { offset, perPage } = weekly;
      const data = weekly.data;
      const slice = data.slice(offset, offset + perPage);
      weekly.pageCount = Math.ceil(data.length / perPage);
      weekly.postData = slice;

      this.setState({
        weekly
      });
    } else {
      const { daily } = this.state;
      const { offset, perPage } = daily;
      const data = daily.data;
      const slice = data.slice(offset, offset + perPage);
      daily.pageCount = Math.ceil(data.length / perPage);
      daily.postData = slice;

      this.setState({
        daily
      });
    }

  }

  handlePrev = (type) => {
    if (type === 0) {
      const { weekly } = this.state;
      const { currentPage, perPage } = this.state.weekly;
      const offset = (currentPage - 1) * perPage;
      weekly.currentPage = currentPage - 1;
      weekly.offset = offset;

      this.setState({
        weekly
      }, () => {
        this.refreshData(type)
      });
    } else {
      const { daily } = this.state;
      const { currentPage, perPage } = this.state.daily;
      const offset = (currentPage - 1) * perPage;
      daily.currentPage = currentPage - 1;
      daily.offset = offset;

      this.setState({
        daily
      }, () => {
        this.refreshData(type)
      });
    }
  }

  handleNext = (type) => {
    if (type === 0) {
      const { weekly } = this.state;
      const { currentPage, perPage } = this.state.weekly;
      const offset = (currentPage + 1) * perPage;
      weekly.currentPage = currentPage + 1;
      weekly.offset = offset;

      this.setState({
        weekly
      }, () => {
        this.refreshData(type)
      });
    } else {
      const { daily } = this.state;
      const { currentPage, perPage } = this.state.daily;
      const offset = (currentPage + 1) * perPage;
      daily.currentPage = currentPage + 1;
      daily.offset = offset;

      this.setState({
        daily
      }, () => {
        this.refreshData(type)
      });
    }
  }

  handleRecieve = async (lotto_type, lotto_id) => {
    this.setState({ loading: true })
    const result = await givePriceToWinners(lotto_type, lotto_id);
    this.setState({ loading: false });
    if (result.success) {
      Toast.fire({
        icon: 'success',
        title: 'You have received rewards successfully!'
      });
      await this.refreshPage();
    } else {
      Toast.fire({
        icon: 'error',
        title: 'Receiving has been failed. Please try again later!'
      });
    }
  }

  render() {
    const { weekly, daily, loading } = this.state;
    return (
      <>
        <div className="container">
          <div className="content mx-auto">
            <div className="row m-t-60 mb-6 msg-content">
              <div className='col-md-12 mb-3'>
                <div className='text-center'>
                  <h2 className="text-app-title">My Winning NFTs</h2>
                </div>
              </div>
              <div className="offset-md-1 col-md-5 col-sm-12">
                <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={900} triggerOnce>
                  <div className="history-content-title">
                    <IconButton color="primary" component="span" sx={{ fontSize: 18, color: 'white' }} onClick={() => this.handlePrev(0)} disabled={weekly.currentPage < 1 ? true : false}>
                      <i className="fa fa-arrow-left" aria-hidden="true"></i>
                    </IconButton>
                    <span className="fs-20 c-app text-white">Progressive Weekly</span>
                    <IconButton color="primary" component="span" sx={{ fontSize: 18, color: 'white' }} onClick={() => this.handleNext(0)}
                      disabled={weekly.currentPage >= weekly.pageCount - 1 ? true : false}>
                      <i className="fa fa-arrow-right" aria-hidden="true"></i>
                    </IconButton>
                  </div>
                  <div className="history-content-item">
                    {weekly.postData.length <= 0 && (
                      <div className="text-center" style={{ padding: '10px' }}>
                        You didn't have any winning NFTs.
                      </div>
                    )}
                    {weekly.postData.map((item, index) => (
                      <div className="history-item" key={index} style={{ backgroundColor: index % 2 === 0 ? '#194068' : '#032444' }}>
                        <div className="row" style={{ alignItems: 'center' }}>
                          <div className="col-md-3 col-sm-3 col-xs-3">
                            <span>{item.no}.</span>
                          </div>
                          <div className="col-md-4 col-sm-4 col-xs-4">
                            <span>{item.date}</span>
                          </div>
                          <div className="col-md-5 col-sm-5 col-xs-5" align="right">
                            {Number(item.amount) === 0 ? (
                              <button className="btn-receive" onClick={() => this.handleRecieve(item.lottery_type, item.lottery_id)}>Receive</button>
                            ) : (
                              <span>{item.amount} AVAX <i className="fa fa-check text-white"></i></span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
              <div className="col-md-5 col-sm-12">
                <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={900} triggerOnce>
                  <div className="history-content-title">
                    <IconButton color="primary" component="span" sx={{ fontSize: 18, color: 'white' }} onClick={() => this.handlePrev(1)} disabled={daily.currentPage < 1 ? true : false}>
                      <i className="fa fa-arrow-left" aria-hidden="true"></i>
                    </IconButton>
                    <span className="fs-20 c-app text-white">48 Hour Drawings</span>
                    <IconButton color="primary" component="span" sx={{ fontSize: 18, color: 'white' }} onClick={() => this.handleNext(1)}
                      disabled={daily.currentPage >= daily.pageCount - 1 ? true : false}>
                      <i className="fa fa-arrow-right" aria-hidden="true"></i>
                    </IconButton>
                  </div>
                  <div className="history-content-item">
                    {daily.postData.length <= 0 && (
                      <div className="text-center" style={{ padding: '10px' }}>
                        You didn't have any winning NFTs.
                      </div>
                    )}
                    {daily.postData.map((item, index) => (
                      <div className="history-item" key={index} style={{ backgroundColor: index % 2 === 0 ? '#194068' : '#032444' }}>
                        <div className="row">
                          <div className="col-md-3 col-sm-3 col-xs-3">
                            <span>{item.no}.</span>
                          </div>
                          <div className="col-md-4 col-sm-4 col-xs-4">
                            <span>{item.date}</span>
                          </div>
                          <div className="col-md-5 col-sm-5 col-xs-5" align="right">
                            {Number(item.amount) === 0 ? (
                              <button className="btn-receive" onClick={() => this.handleRecieve(item.lottery_type, item.lottery_id)}>Receive</button>
                            ) : (
                              <span>{item.amount} AVAX <i className="fa fa-check text-white"></i> </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
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
        </div>
      </>
    );
  }
};

const mapStateToProps = state => ({
  walletState: state.wallet.walletState,
});

const mapDispatchToProps = () => ({});

export default compose(connect(
  mapStateToProps,
  mapDispatchToProps()
))(NftHistory);