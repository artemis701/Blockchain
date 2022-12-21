import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import { fromWei, numberWithCommas } from '../../utils';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export default function FormDialog({ type, open, price, balance, handleBuy, handleClose }) {
  const [count, setCount] = useState(1);
  const [payAmount, setPayAmount] = useState(0);
  const handleChange = (event) => {
    if (!isNaN(event.target.value)) {
      const value = Math.floor(event.target.value);
      setCount(value);
    }
  }
  useEffect(() => {
    const amount = fromWei(price) * Number(count);
    setPayAmount(numberWithCommas(amount));
  }, [price, count])

  return (
    <div>
      <Dialog open={open} onClose={handleClose} sx={{borderRadius: '20px'}}>
        <Reveal className='onStep' keyframes={fadeIn} delay={0} duration={900} triggerOnce>
          <div style={{ padding: '20px' }}>
            {type === 0 ? (
              <img src="img/background/weekly_nft.png" alt=""></img>
            ) : (
              <img src="img/background/daily_nft.png" alt=""></img>
            )}
          </div>
        </Reveal>
        <DialogTitle sx={{textAlign: 'center', color: type === 0 ? '#73ccb7' : '#f91d4d'}}>You will be a Winner!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please insert the count to purchase NFTs.
          </DialogContentText>
          <TextField
            margin="dense"
            id="name"
            value={count}
            fullWidth
            variant="standard"
            onChange={handleChange}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]', align: 'center' }}
            className='text-center'
          />
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <span>You will pay: {payAmount} AVAX</span>
            <span>Your Balance: {numberWithCommas(balance)} AVAX</span>
          </div>
        </DialogContent>
        <DialogActions 
          sx={{justifyContent: 'space-evenly',
              marginBottom: '10px'}}>
          <Button variant='contained'
            sx={{
              backgroundColor: "#50BFA5",
              borderRadius: '20px',
              '&:hover': {
                backgroundColor: "#7fd9c4",
                transition: 'all 0.3s ease'
              },
            }}
            onClick={handleClose}>Cancel</Button>
          <Button variant='contained'
            sx={{
              backgroundColor: "#50BFA5",
              borderRadius: '20px',
              '&:hover': {
                backgroundColor: "#7fd9c4",
                transition: 'all 0.3s ease'
              },
            }}
            onClick={() => handleBuy(count)}>Buy NFT</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
