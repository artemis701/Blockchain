import { FunctionComponent, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import './App.css';
import API from './api';
import { setExchange } from './store/actions/dex';
import { 
  sourceCurrencySelector,
  targetAmountSelector,
  networkFeeSelector, 
  c14FeeSelector, 
  totalFeeSelector 
} from "./store/reducers/dex";

// function App() {
const App:FunctionComponent<{ 
                              initUSD?: string, 
                              initUSDC?: string, 
                              initNetworkFee?: string, 
                              initC14Fee?: string, 
                              initTotalFee?: string }> = 
                           ({ 
                              initUSD = "0.0", 
                              initUSDC = "0.0", 
                              initNetworkFee = "0.0", 
                              initC14Fee = "0.0", 
                              initTotalFee = "0.0" }) => 
{
  const dispatch = useDispatch();

  const [usd, setUSD] = useState(initUSD);
  const [usdc, setUSDC] = useState(initUSDC);

  const sourceCurrency = useSelector( state => sourceCurrencySelector(state) );
  const targetAmount = useSelector( state => targetAmountSelector(state) );
  const networkFee = useSelector( state => networkFeeSelector(state) );
  const c14Fee = useSelector( state => c14FeeSelector(state) );
  const totalFee = useSelector( state => totalFeeSelector(state) );
  
  useEffect(() => {
    if (sourceCurrency == "USD") {
      setUSDC(targetAmount);
    } else if (sourceCurrency == "USDC") {
      setUSD(targetAmount);
    }
  }, [sourceCurrency, targetAmount]);

  const onUpdateUSD = (value:string) => {
    console.log("onUpdateUSD called : " + value);
    setUSD(value);

    console.log("usd value = " + value);

    if (parseFloat(value) < 100.0)
      return;
      
    dispatch(setExchange(
      "USD",
      "b2384bf2-b14d-4916-aa97-85633ef05742",
      value,
      "0.0"
    ));   
  };

  const onUpdateUSDC = (value:string) => {
    /*
    console.log("onUpdateUSDC called : " + value);
    setUSDC(value);

    console.log("usdc value = " + value);

    dispatch(setExchange(
      "USDC",
      "b2384bf2-b14d-4916-aa97-85633ef05742",
      value,
      "0.0"
    ));
    */
  };

  const onBuyNow = () => {
    console.log("usd value = " + parseFloat(usd));
    console.log("usdc value = " + parseFloat(usdc));
  }

  return (
    <div className="App">
      <section>
        <div className='swap-box'>
          <h1 className='swap-box-title text-center'>Select Your Amount</h1>
          <div className='input-form-control'>
            <label className='input-label'>You Pay</label>
            <div className='input-control'>
              <input type="number" value={usd} onChange={(e) => onUpdateUSD(e.target.value)}></input>
              <div className='token-control'>
                <span className='token-label'>USD</span>
                <img className='token-icon' src="/images/usd.png" alt=""></img>
              </div>
            </div>
          </div>
          <div className='fee-box'>
            <label className='fee-label'>Fees</label>
            <div className='fee-control flex flex-row'>
              <div className='flex flex-col'>
                <span className='fee-title'>Network Fee</span>
                <br />
                <span className='fee-value'>{networkFee}$</span>
              </div>
              <span className='fee-operator'>+</span>
              <div className='flex flex-col'>
                <span className='fee-title'>C14 Fee</span>
                <br />
                <span className='fee-value'>{c14Fee}$</span>
              </div>
              <span className='fee-operator'>=</span>
              <div className='flex flex-col'>
                <span className='fee-title'>Total Fee</span>
                <br />
                <span className='fee-value bold'>{totalFee}$</span>
              </div>
            </div>
          </div>
          <div className='input-form-control'>
            <label className='input-label'>You Receive</label>
            <div className='input-control'>
              <input type="number" value={usdc} onChange={(e) => onUpdateUSDC(e.target.value)}></input>
              <div className='token-control'>
                <span className='token-label'>USDC EVMOS</span>
                <img className='token-icon' src="/images/evmos.png" alt=""></img>
              </div>
            </div>
          </div>
          <div className='buy-box'>
            <button className='btn-buy' onClick={onBuyNow}>Buy Now</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
