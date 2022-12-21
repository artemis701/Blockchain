import React, { useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Toast, isEmpty, getUTCTimestamp } from "../../utils";
import { changeLotteryInfo, setTeamFundsAddress } from "../../core/web3";

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          margin: '10px 0',
          width: '100%'
        }
      }
    },
    MuiFormControl: {
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
          background: 'white',
          borderColor: '#50BFA5',
          outlineColor: '#50BFA5',
          '&:hover': {
            border: 'none'
          }
        },
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused' : {
            top: '-10px !important',
            color: 'white',
          }
        },
        shrink: {
          color: 'white',
          fontSize: '18px',
          top: '-10px',
          transform: 'translate(14px, -9px) scale(0.75)'
        },
      }
    }
  }
});

const ControlData = ({ weeklyID, dailyID }) => {
  const [lotteryID1, setLotteryID1] = React.useState(0);
  const [status1, setStatus1] = React.useState('');
  const [date1, setDate1] = React.useState(new Date());
  const [lotteryID2, setLotteryID2] = React.useState(0);
  const [status2, setStatus2] = React.useState('');
  const [date2, setDate2] = React.useState(new Date());
  const [teamFunds, setTeamFunds] = React.useState('');

  useEffect(() => {
    setLotteryID1(weeklyID);
    setLotteryID2(dailyID);
  }, [weeklyID, dailyID])

  const handleDate1 = (newValue) => {
    setDate1(newValue);
  };

  const handleStatus1 = (event) => {
    setStatus1(event.target.value);
  };

  const handleID1 = (event) => {
    setLotteryID1(event.target.value);
  }

  const handleDate2 = (newValue) => {
    setDate2(newValue);
  };

  const handleStatus2 = (event) => {
    setStatus2(event.target.value);
  };

  const handleID2 = (event) => {
    setLotteryID2(event.target.value);
  }

  const handleTeamFunds = (event) => {
    setTeamFunds(event.target.value);
  }

  const validation1 = () => {
    if (isEmpty(lotteryID1)) {
      Toast.fire({
        icon: 'error',
        title: `Please insert Lottery ID`
      });
      return false;
    }
    if (isEmpty(status1)) {
      Toast.fire({
        icon: 'error',
        title: `Please select a lottery status.`
      });
      return false;
    }
    return true;
  }
  
  const validation2 = () => {
    if (isEmpty(lotteryID2)) {
      Toast.fire({
        icon: 'error',
        title: `Please insert Lottery ID`
      });
      return false;
    }
    if (isEmpty(status2)) {
      Toast.fire({
        icon: 'error',
        title: `Please select a lottery status.`
      });
      return false;
    }
    return true;
  }
  const handleSubmit1 = async () => {
    if (!validation1()) {
      return;
    }
    const timeStamp = getUTCTimestamp(date1);
    const result = await changeLotteryInfo(0, Number(lotteryID1), Number(status1), timeStamp / 1000);
    if (result.success) {
      Toast.fire({
        icon: 'success',
        title: `Updated lottery successfully!`
      });
    }
  }
  const handleSubmit2 = async () => {
    if (!validation2()) {
      return;
    }
    const timeStamp = getUTCTimestamp(date2);
    const result = await changeLotteryInfo(1, Number(lotteryID2), Number(status2), timeStamp / 1000);
    if (result.success) {
      Toast.fire({
        icon: 'success',
        title: `Updated lottery successfully!`
      });
    }
  }

  const handleSubmitTS = async () => {
    if (isEmpty(teamFunds)) {
      Toast.fire({
        icon: 'error',
        title: `Please insert a valid value.`
      });
      return;
    }
    const result = await setTeamFundsAddress(teamFunds);
    if (result.success) {
      Toast.fire({
        icon: 'success',
        title: `Updated address successfully!`
      });
    }
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <section className="container nft-admin-container">
          <div className="content mx-auto">
            <div className="row">
              <div className="msg-admin-content col-md-6">
                <h3 className="text-white">
                  Progressive Weekly NFT
                </h3>
                <TextField type="number" label={'Lottery ID'} id="lottery_id" value={lotteryID1} onChange={handleID1} />
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Lottery Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={status1}
                    label="Lottery Status"
                    onChange={handleStatus1}
                  >
                    <MenuItem value={0}>START</MenuItem>
                    <MenuItem value={1}>CLOSED</MenuItem>
                    <MenuItem value={2}>PICKED</MenuItem>
                  </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Start Date"
                    value={date1}
                    onChange={handleDate1}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <button className="btn-main lead round-button mb-2 fs-18" onClick={handleSubmit1}>UPDATE</button>
              </div>
              <div className="msg-admin-content col-md-6">
                <h3 className="text-white">
                  48 Hour Drawings NFT
                </h3>
                <TextField type="number" label={'Lottery ID'} id="lottery_id" value={lotteryID2} onChange={handleID2} />
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Lottery Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={status2}
                    label="Lottery Status"
                    onChange={handleStatus2}
                  >
                    <MenuItem value={0}>START</MenuItem>
                    <MenuItem value={1}>CLOSED</MenuItem>
                    <MenuItem value={2}>PICKED</MenuItem>
                  </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Start Date"
                    value={date2}
                    onChange={handleDate2}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <button className="btn-main lead round-button mb-2 fs-18" onClick={handleSubmit2}>UPDATE</button>
              </div>
            </div>
          </div>
        </section>
        <section className="container nft-admin-container">
          <div className="content mx-auto">
            <div className="msg-control">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  '& .MuiTextField-root': { width: '25ch' },
                }}
              >
                <TextField type="text" label={'Address for team Funds'} id="lottery_id" onChange={handleTeamFunds} />
              </Box>
              <button className="btn-main lead round-button mb-2 fs-18" onClick={handleSubmitTS}>UPDATE</button>
            </div>
          </div>
        </section>
      </ThemeProvider>
    </>
  );
};

export default ControlData;