import React, { useEffect, useState } from "react";
import { setDefaultBreakpoints } from "react-socks";
import { connectWallet, getBalance } from '../../core/web3';

setDefaultBreakpoints([
  { xs: 0 },
  { l: 1199 },
  { xl: 1200 }
]);

const Header = function () {
  const [showConnect, setShowConnect] = useState(true);
  const [balance, setBalance] = useState(0);
  const [wallet, setWallet] = useState('');

  useEffect(() => {
    const header = document.getElementById("myHeader");
    const totop = document.getElementById("scroll-to-top");
    const sticky = header.offsetTop;
    const scrollCallBack = window.addEventListener("scroll", () => {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        totop.classList.add("show");

      } else {
        header.classList.remove("sticky");
        totop.classList.remove("show");
      } if (window.pageYOffset > sticky) {
      }
    });
    addWalletListener();
    return () => {
      window.removeEventListener("scroll", scrollCallBack);
    };
  }, []);

  function addWalletListener () {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          setShowConnect(false);
          setWallet(accounts[0]);
          const data = await getBalance();
          if (data.success) {
            setBalance(data.balance);
          }
        } else {
          setShowConnect(true);
        }
      });

      window.web3.eth.getAccounts(async function(err, accounts) {
        if (accounts.length > 0) {
          setShowConnect(false);
          setWallet(accounts[0]);
          const data = await getBalance();
          if (data.success) {
            setBalance(data.balance);
          }
        }
      });
    }
  }

  async function connectWalletFunc() {
    const data = await connectWallet();
    if (data.status) {
      setShowConnect(false);
      setWallet(data.account);
      const dataVal = await getBalance();
      if (dataVal.success) {
        setBalance(dataVal.balance);
      }
    }
  }

  return (
    <header id="myHeader" className='navbar white'>
      <div className='container'>
        <div className='row w-100-nav'>
          <div className='logo px-0'>
            <div className='navbar-title navbar-item'>
            </div>
          </div>
          <div className='mainside'>
            <div className='connect-wal'>
              {showConnect ? (
                <button className='btn-main inline lead' onClick={connectWalletFunc}>Connect Wallet</button>
              ) : (
                <>
                <div className="text-white">{wallet && (wallet.slice(0, 6) + "..." + wallet.slice(38))}</div>
                <div className="text-white">{balance} ETH</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
export default Header;