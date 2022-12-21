import * as React from 'react';
import classNames from 'classnames';
import styled, { createGlobalStyle } from "styled-components";
import { CSSTransition } from "react-transition-group";
import { connect } from 'react-redux';
import { compose } from 'redux';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import { withStyles } from '@material-ui/core/styles';
import { glide } from 'react-tiger-transition';
import { toast } from 'react-toastify';
import ReactLoading from "react-loading";
import $ from 'jquery';
import ComposedTextField from './ComposedTextField';
import InputTags from './InputTags';
import DropzoneAreaExt from './DropzoneAreaExt';
import {
  numberWithCommas,
  isEmpty,
  getUTCTimestamp,
  validationStartTime,
  SuccessModal,
  WarningModal,
  ErrorModal
} from '../../utils';
import { getAccount, getBalance, approveGD, createTweetStormURI, addTweetStorm } from '../../core/web3';

const CssTextField = styled(TextField)({
  margin: '10px 0px',
  '& label.Mui-focused': {
    color: 'white',
    fontSize: '18px',
    top: '-13px'
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'transparent',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: 'transparent',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'transparent',
    },
  },
});

const GlobalStyles = createGlobalStyle`
  .relative_panel {
    position: relative;
  }
  .text_option1 {
    position: absolute;
    right: 9%;
    top: -16%;
    color: white;
  }
  .text_option2 {
    position: absolute;
    right: 9%;
    top: -16%;
    color: white;
  }
  .MuiStepIcon-root.Mui-active, .MuiStepIcon-root.Mui-completed {
    color: #338fd0 !important;
  }

  .MuiButton-root.Mui-disabled {
    color:#a5a5a5 !important;
    border-color: #a5a5a5 !important;
  }

  .MuiDropzoneArea-text {
    font-size: 20px;
    margin: 16px 0 1px 0 !important;
    @media only screen and (max-width: 640px) { 
      font-size: 16px;
    }
  }

  .MuiDropzonePreviewList-image {
    max-height: 65px !important;
  }

  .MuiDropzonePreviewList-removeButton {
    border-color: transparent;
  }
  .MuiDropzoneArea-icon {
    color: white !important;
  }
  .form_title {
    span {
      font-size: 20px;
      @media only screen and (max-width: 640px) { 
        font-size: 16px;
      }
    }
    h1 {
      font-size: 60px;
      margin: 0px;
      @media only screen and (max-width: 640px) { 
        font-size: 35px;
      }
    }
  }

  .storm-box {
    width: 600px;
    height: 635px;
    background-color: rgb(29 89 141 / 80%);
    position: absolute;
    border-radius: 60px;
    padding: 40px 80px;
    margin: 55px;
    @media only screen and (max-width: 640px) { 
      width: 390px;
      height: 590px;
      padding: 40px 35px;
      margin: 55px;
    }
    @media only screen and (max-width: 420px) { 
      width: 320px;
      height: 590px;
      padding: 40px 35px;
      margin: 55px;
    }
  }

  .react-tag-input {
    overflow-x: auto;
    flex-wrap: nowrap;
    margin: 24px 0 25px;
    border-radius: 0;
    padding: 5px 9px;
  }

  ::-webkit-scrollbar-track
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
    overflow-x: auto;
  }
  
  ::-webkit-scrollbar
  {
    width: 6px;
    height: 6px;
    background-color: #F5F5F5;
    overflow-x: auto;
  }
  
  ::-webkit-scrollbar-thumb
  {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #338fd0;
    overflow-x: auto;
  }

  .method-enter {
    opacity: 0;
  }
  
  .method-enter-active {
    opacity: 1;
    transition: opacity 500ms ease-in;
  }
  
  .method-exit {
    opacity: 1;
  }
  
  .method-exit-active {
    opacity: 0;
    transition: opacity 500ms ease-out;
  }

  .panel_2 {
    @media only screen and (min-width: 600px) { 
      display: flex;
      flex-direction: row;
      gap: 10px;
      margin: 30px 0 40px 0;
    }
    .MuiFormControl-root {
      width: 100%;
    }
  }
`;


const steps = [0, 1, 2, 3];

const theme = createTheme({
  components: {
    MuiDivider: {
      styleOverrides: {
        root: {
          height: '5px !important',
          color: 'white',
          opacity: 1,
          margin: '12px 28% 30px 28% !important'
        }
      }
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          justifyContent: 'space-around'
        }
      }
    },
    MuiStepConnector: {
      styleOverrides: {
        root: {
          display: 'none'
        }
      }
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          width: '40px !important',
          height: '40px !important',
          border: 'solid 2px white',
          borderRadius: '50%',
          color: 'transparent'
        },
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: 'white !important',
          border: 'solid 2px white !important',
          borderRadius: '24px !important',
          padding: '5px 35px !important',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          margin: '10px 0',
          width: '100%'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          background: 'white',
          borderColor: 'transparent',
          // display: 'block',
          // paddingRight: '0px',
          '&:hover': {
            border: 'none'
          }
        },
        input: {
          padding: '10px 10px',
          width: '90%'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '15px',
          top: '-6px',
        },
        shrink: {
          color: 'white',
          fontSize: '18px',
          top: '-13px',
          transform: 'translate(14px, -9px) scale(0.75)'
        },
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          // position: 'absolute',
          // top: '3px',
          // right: '10px'
        }
      }
    }
  }
});

const InfoLabel = styled.div`
  display: flex;
  flex-direction: row;
  width: 60%;
  span {
    flex: 1 10px;
  }
  @media only screen and (max-width: 640px) { 
    width: 100%;
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

const PayLabel = ({ label = '', price = '' }) => {
  return (
    <InfoLabel>
      <span className='text-white'>{label}:</span>
      <span className='text-white'>{numberWithCommas(price)} G$</span>
    </InfoLabel>
  )
}

const useStyles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  transitionContainer: {
    position: 'relative',
    width: '100%',
    height: 235,
    perspective: 1200,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  transitionLayout: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    // top: 0,
    // left: 0,
    transform: `translate3d(0, 0, 0)`,
    transformStyle: 'preserve-3d',
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
  },
  transitionScreen: {
    width: '100%',
    height: '100%',
    position: 'relative',
    // display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


class TweetStormSteper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      transition: 'transition-left',
      walletConnected: false,
      loading: false,
      warning: '',
      fee: 0,
      total_cost: 0,
      balance: 0,
      fields: {
        name: '',
        url: '',
        reward: '',
        number: '',
        start_date: null,
        duration: '',
        share_text: '',
        username: '',
        hash_tags: [],
        image: null,
      },
      errors: {
        name: false,
        url: false,
        reward: false,
        number: false,
        start_date: false,
        duration: false,
      }
    }
  }

  addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          const data = await getBalance();
          if (data.success) {
            this.setState({ balance: data.balance, walletConnected: true });
          }
        } else {
          this.setState({ walletConnected: false });
        }
      });
      window.ethereum.on('chainChanged', async (chainId) => {
        const data = await getBalance();
        if (data.success) {
          this.setState({ balance: data.balance, walletConnected: true });
        }
      });
      window.web3.eth.getChainId().then(async (chainId) => {
        const data = await getBalance();
        if (data.success) {
          this.setState({ balance: data.balance, walletConnected: true });
        }
      })
    }
  }

  async componentDidMount() {
    this.addWalletListener();
  }

  validation = () => {
    const { activeStep, fields, errors, walletConnected } = this.state;
    let retValue = true;
    if (!walletConnected) {
      toast.error("Please connect your wallet!");
      return false;
    }
    switch (activeStep) {
      case 0:
        if (isEmpty(fields.name)) { errors.name = true; retValue = false; }
        if (isEmpty(fields.url)) { errors.url = true; retValue = false; }
        this.setState({ errors });
        break;
      case 1:
        if (isEmpty(fields.reward) || fields.reward <= 0) { errors.reward = true; retValue = false; }
        if (isEmpty(fields.number) || fields.number <= 0) { errors.number = true; retValue = false; }
        if (!fields.start_date || !validationStartTime(fields.start_date)) { errors.start_date = true; retValue = false; }
        if (isEmpty(fields.duration) || fields.duration < 0) { errors.duration = true; retValue = false; }
        this.setState({ errors });
        if (this.state.total_cost > this.state.balance) {
          WarningModal();
          retValue = false;
        }
        break;
      case 2:
        break;
      default:
        break;
    }
    return retValue;
  }

  handleNext = () => {
    if (!this.validation()) { return; }
    const { activeStep } = this.state;
    this.setState({ activeStep: activeStep + 1 });
    this.setState({ transition: 'transition-left' });
  };

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({ activeStep: activeStep - 1 });
    this.setState({ transition: 'transition-right' });
  };

  handleCreate = async () => {
    const { fields, total_cost } = this.state;    
    if (!this.validation()) { return; }
    const { avatarLoading } = this.props;
    if (avatarLoading.data) {
      toast.error("Your avatar is uploading. Please try again later.");
      return;
    }
    this.setState({ loading: true, warning: 'Uploading...' });
    const tweetStormInfo = { ...fields, total_cost };
    let tweetStormURI = '';
    if (tweetStormInfo.image) {
      const data = await createTweetStormURI(tweetStormInfo.image);
      if (data.success) {
        tweetStormURI = data.token_uri;
      }
    }
    this.setState({ warning: 'Approving...' });
    let ret_val = await getAccount();
    if (ret_val.success) {
      const account = ret_val.account;
      ret_val = await approveGD(account, total_cost);
      if (ret_val.success) {
        this.setState({ warning: 'Creating...' });
        ret_val = await addTweetStorm(account, tweetStormInfo, tweetStormURI);
        this.setState({ loading: false, warning: '' });
        if (ret_val.success) {
          SuccessModal();
        } else {
          ErrorModal();
        }
      } else {
        toast.error(ret_val.status);
        this.setState({ loading: false, warning: '' });
      }
    } else {
      toast.error(ret_val.status);
      this.setState({ loading: false, warning: '' });
    }
  };

  handleDate = (newDate) => {
    let fields = this.state.fields;
    let errors = this.state.errors;
    const utc_time = getUTCTimestamp(newDate);
    fields.start_date = utc_time;
    errors.start_date = false;

    this.setState({ fields, errors });
  };

  handleChange = (e) => {
    let fields = this.state.fields;
    let errors = this.state.errors;
    fields[e.target.name] = e.target.value;
    errors[e.target.name] = isEmpty(fields[e.target.name]);
    this.setState({ fields, errors });
    if (((e.target.name === 'reward' && fields.number > 0) ||
      (e.target.name === 'number' && fields.reward > 0)) &&
      e.target.value > 0 && fields.number > 0) {
      let field_value = 0;
      if (e.target.name === 'reward') {
        field_value = parseFloat(fields.number);
      } else {
        field_value = parseFloat(fields.reward);
      }
      const amount = parseFloat(e.target.value) * field_value;
      const fee = amount * 10 / 100;
      const total_cost = amount * 110 / 100;
      this.setState({ fee, total_cost });
    }
  }

  handleTagChange = (value) => {
    let fields = this.state.fields;
    fields['hash_tags'] = value;
    this.setState({ fields });
  }

  handleImage = async (event) => {
    let fields = this.state.fields;
    var files = event;
    if (files.length > 0) {
      const blob = await (await fetch(files[0].data)).blob(); 
      const file = new File([blob], 'image.png', blob)
      fields['image'] = file;
      this.setState({ fields });
    }
  }

  render() {
    const { classes } = this.props;
    const { activeStep, fields, errors, transition } = this.state;

    glide({
      name: 'transition-left',
      enter: {
        duration: 600,
        easing: 'easeOutQuad',
        opacity: 1,
        zIndex: 2,
        scale: 1,
        delay: 0
      },
      exit: {
        duration: 300,
        easing: 'easeOutQuad',
        opacity: 0.2,
        zIndex: 1,
        scale: 1,
        delay: 0
      }
    });

    glide({
      name: 'transition-right',
      direction: 'right',
      enter: {
        duration: 600,
        easing: 'easeOutQuad',
        opacity: 1,
        zIndex: 2,
        scale: 1,
        delay: 0
      },
      exit: {
        duration: 300,
        easing: 'easeOutQuad',
        opacity: 0.2,
        zIndex: 1,
        scale: 1,
        delay: 0
      }
    });

    const minDate = new Date();
    return (
      <>
        <GlobalStyles />
        <ThemeProvider theme={theme}>
          <div className="storm-box">
            <div className='form_title'>
              {activeStep === 0 ? (
                <>
                  <span className="text-white">ANYONE CAN CREATE A</span>
                  <h1 align="center">TWEETSTORM</h1>
                  <Divider sx={{ height: '20px' }} variant='middle' />
                </>
              ) : (
                <>
                  <span className="text-white">REWARD GOODDOLLARS TO</span>
                  <h1 align="center">RETWEETERS</h1>
                  <Divider sx={{ height: '20px' }} variant='middle' />
                </>
              )}
            </div>
            <Stepper nonLinear activeStep={activeStep}>
              {steps.map((label, index) => {
                return (
                  <Step key={label}>
                    <StepLabel></StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <div className={classes.transitionContainer}>
              {steps.map(tab => (
                <CSSTransition
                  key={tab}
                  mountOnEnter
                  unmountOnExit
                  in={tab === activeStep}
                  timeout={600}
                  classNames={transition}
                >
                  <div className={classes.transitionLayout}>
                    <div className={classNames(classes.transitionScreen, classes[tab])}>
                      {tab === 0 && (
                        <>
                          <ComposedTextField 
                            id="name"
                            name="name" 
                            onKeyUp={(event) => { 
                              if (event.keyCode === 13) {
                                $('#url').focus();
                                return;
                              }
                            }} 
                            onChange={this.handleChange} 
                            value={fields.name} 
                            error={errors.name} 
                            style={{ margin: '50px 0 0 0' }} 
                            label="TweetStorm Name" />
                          <ComposedTextField 
                            id="url"
                            name="url" 
                            onKeyUp={(event) => { 
                              if (event.keyCode === 13) {
                                this.handleNext();
                                $('#reward').focus();
                                return;
                              }
                            }} 
                            onChange={this.handleChange} 
                            value={fields.url} 
                            error={errors.url} 
                            style={{ margin: '50px 0' }} 
                            label="Tweet URL" />
                        </>
                      )}
                      {tab === 1 && (
                        <>
                          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', margin: '40px 0 0 0' }}>
                            <ComposedTextField 
                              id="reward"
                              name="reward" 
                              onKeyUp={(event) => { 
                                if (event.keyCode === 13) {
                                  $('#number').focus();
                                  return;
                                }
                              }} 
                              onChange={this.handleChange} 
                              value={fields.reward} 
                              error={errors.reward} 
                              type="number" 
                              style={{ margin: '10px 0' }} 
                              label="G$ Reward Per Tweet" />
                            <ComposedTextField 
                              id="number" 
                              name="number" 
                              onKeyUp={(event) => { 
                                if (event.keyCode === 13) {
                                  $('#start_date').focus();
                                  return;
                                }
                              }} 
                              onChange={this.handleChange} 
                              value={fields.number} 
                              error={errors.number} 
                              type="number" 
                              style={{ margin: '10px 0' }} 
                              label="Max Number Of Rewards" />
                          </div>
                          <div className="panel_2">
                          <Box
                              component="div"
                              noValidate
                              autoComplete="off"
                              style={{flex: 1}}
                          >
                            <div style={{position: 'relative'}}>
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                  label="Start Date"
                                  minDate={minDate}
                                  inputFormat="MM/dd/yyyy"
                                  value={fields.start_date}
                                  onChange={this.handleDate}
                                  renderInput={(params) => 
                                    <CssTextField 
                                      {...params} 
                                      id="start_date" 
                                      onKeyUp={(event) => { 
                                        if (event.keyCode === 13) {
                                          $('#duration').focus();
                                          return;
                                        }
                                      }} 
                                      sx={{ width: 'auto' }} 
                                      error={errors.start_date} 
                                    />}
                                />
                              </LocalizationProvider>
                            </div>
                            </Box>
                            <ComposedTextField 
                              id="duration"
                              name="duration" 
                              onKeyUp={(event) => { 
                                if (event.keyCode === 13) {
                                  this.handleNext();
                                  $('#share_text').focus();
                                  return;
                                }
                              }} 
                              onChange={this.handleChange} 
                              value={fields.duration} 
                              error={errors.duration}
                              type="number" 
                              style={{ margin: '10px 0' }} 
                              label="Duration(days)" />
                          </div>
                        </>
                      )}
                      {tab === 2 && (
                        <div className="relative_panel">
                          <span className="text_option1">All fields are optional</span>
                          <ComposedTextField 
                            id="share_text"
                            name="share_text" 
                            onKeyUp={(event) => { 
                              if (event.keyCode === 13) {
                                $('#username').focus();
                                return;
                              }
                            }} 
                            onChange={this.handleChange} 
                            value={fields.share_text} 
                            style={{ margin: '35px 0 0 0' }} 
                            label="Tweet Share Text" />
                          <ComposedTextField 
                            id="username"
                            name="username" 
                            onKeyUp={(event) => { 
                              if (event.keyCode === 13) {
                                $('#hash_tags').focus();
                                return;
                              }
                            }} 
                            onChange={this.handleChange} 
                            value={fields.username} 
                            style={{ margin: '24px 0 0 0' }} 
                            label="Twitter Username" />
                          <InputTags id="hash_tags" name="hash_tags" value={fields.hash_tags} onChange={this.handleTagChange} />
                        </div>
                      )}
                      {tab === 3 && (
                        <div className="relative_panel">
                          <span className="text_option2">This field is optional</span>
                          <div style={{ margin: '35px 0 20px 0' }}>
                            <DropzoneAreaExt handleChange={this.handleImage} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CSSTransition>
              ))}
            </div>
            <React.Fragment>
              <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'right', alignItems: 'end', mb: 2 }}>
                <PayLabel label={'Fee'} price={this.state.fee.toString().slice(0, 10)}></PayLabel>
                <PayLabel label={'Total Cost'} price={this.state.total_cost.toString().slice(0, 10)}></PayLabel>
                <PayLabel label={'Your Balance'} price={this.state.balance.toString().slice(0, 12)}></PayLabel>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '10px' }}>
                <Button onClick={this.handleBack} disabled={activeStep === 0}>
                  <ArrowBackIosIcon fontSize='small' /> BACK
                </Button>
                {activeStep > 0 && (
                  <Button onClick={this.handleCreate}> CREATE </Button>
                )}
                <Button onClick={this.handleNext} disabled={activeStep === steps.length - 1}>
                  NEXT <ArrowForwardIosIcon fontSize='small' />
                </Button>
              </Box>
            </React.Fragment>
          </div>
        </ThemeProvider>
        {<Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.loading}
        >
          <Loading>
            <ReactLoading type={'spinningBubbles'} color="#fff" />
            <Prop>{this.state.warning}</Prop>
          </Loading>
        </Backdrop>}
      </>
    );
  }
}

const mapStateToProps = state => ({
  avatarURI: state.avatar.profileAvatar,
  avatarLoading: state.avatar.profileLoading
});

const mapDispatchToProps = () => ({});

export default compose(connect(
  mapStateToProps,
  mapDispatchToProps()
), withStyles(useStyles))(TweetStormSteper);