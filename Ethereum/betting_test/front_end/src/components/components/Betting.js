import React, { useState } from 'react';
import styled from "styled-components";
import { toast } from 'react-toastify';
import Backdrop from '@mui/material/Backdrop';
import Swal from 'sweetalert2';
import ReactLoading from "react-loading";
import { bettingNow, getBalance } from '../../core/web3';
import { ErrorModal, WarningModal } from '../../utils';

export const Prop = styled('h3')`f5 f4-ns mb0 white`;

const Loading = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;
`;

//react functional component
const Betting = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [betNum, setBetNum] = useState(0);
  const [selectCoin, setSelectCoin] = useState(0);

  const handleChange = (event) => {
    setAmount(event.target.value);
  }

  const handleCheck = (event) => {
    if (event.target.name === 'bet1') {
      setBetNum(1);
    } else if (event.target.name === 'bet2') {
      setBetNum(2);
    } else {
      setBetNum(0);
    }
  }

  const handleBetting = async () => {
    setSelectCoin(0);
    if (!amount || amount <= 0) {
      toast.error('Please insert a betting amount!');
      return;
    }
    try {
      const data = await getBalance();
      if (data.success) {
        if (data.balance <= amount) {
          WarningModal();
          return;
        }
      } else {
        toast.error(data.result);
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
    
    if (betNum === 0) {
      toast.error('Please select coin!');
      return;
    }
    setIsLoading(true);
    try {
      const result = await bettingNow(betNum - 1, amount);
      console.log(result);
      if (result.success) {
        if (result.status) {
          Swal.fire({
            title: `<span style="color: #6dc53d">Congratulation!</span>`,
            html: `You got ${amount * 2} ETH in this betting.<br/>Please try again to get more ETH.`,
            imageUrl: 'img/congratulation.png',
            imageWidth: 210,
            imageHeight: 165,
            imageAlt: 'Congratulation',
            confirmButtonColor: '#6dc53d',
          });
          setSelectCoin(betNum);
        } else {
          ErrorModal();
          setSelectCoin(betNum === 1 ? 2 : 1);
        }
      }
    } catch (error) {

    } finally {
      setIsLoading(false);  
    }
  }

  return (
    <>
      <div className='row'>
        <div className="col-md-12 mb-4" align="center">
          <h4>Betting Amount</h4>
          <input type="number" className="betting_amount" onChange={handleChange}></input>
        </div>
        <div className="col-md-12" align="center">
          <h4>Please select expected coin! <br/>You will be WINNER.</h4>
        </div>
        <div className="col-md-2" align="center"></div>
        <div className="col-md-4" align="center">
          <div className="bet_img_item">
            <img src="img/coin1.png" className="coin" alt="" width="150" name="bet1" onClick={handleCheck}></img>
            {betNum === 1 && (
              <span className="check"><i className="fa fa-check"></i></span>
            )}
          </div>
        </div>
        <div className="col-md-4" align="center">
          <div className="bet_img_item">
            <img src="img/coin2.png" className="coin" alt="" width="150" name="bet2" onClick={handleCheck}></img>
            {betNum === 2 && (
              <span className="check"><i className="fa fa-check"></i></span>
            )}
          </div>
        </div>
        <div className="col-md-2" align="center"></div>
        <div className="col-md-12" align="center">
          <button className="betting_button" onClick={handleBetting}>Betting</button>
        </div>
        <div className="col-md-12" align="center">
          <div className="success_panel">
            {selectCoin === 0 && (
              <h3>Result</h3>
            )} 
            {selectCoin === 1 && (
              <img src="img/coin1.png" className="coin" alt="" width="250"></img>
            )}
            {selectCoin === 2 && (
              <img src="img/coin2.png" className="coin" alt="" width="250"></img>
            )}
          </div>
        </div>
      </div>
      {<Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <Loading>
          <ReactLoading type={'spinningBubbles'} color="#fff" />
          <Prop>{'Betting...'}</Prop>
        </Loading>
      </Backdrop>}
    </>
  );
};

export default Betting;