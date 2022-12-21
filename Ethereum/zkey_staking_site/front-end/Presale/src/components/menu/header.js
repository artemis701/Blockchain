import React, { useEffect, useState } from "react";
import Breakpoint, { BreakpointProvider, setDefaultBreakpoints } from "react-socks";
import { useScrollSection } from "react-scroll-section";
import { useDispatch } from 'react-redux';
import { Link } from '@reach/router';
import Popover from '@mui/material/Popover';
import { isMobile } from '../../utils';
import { connectWallet, getBalance } from '../../core/web3';
import { setWalletState, setRefreshState } from "../../store/actions/thunks";

setDefaultBreakpoints([
  { xs: 0 },
  { l: 1199 },
  { xl: 1200 }
]);

const NavLink = props => (
  <Link
    {...props}
    getProps={({ isCurrent }) => {
      // the object returned here is passed to the
      // anchor element's props
      return {
        className: isCurrent ? 'active' : 'non-active',
      };
    }}
  />
);

const Header = function () {
  const dispatch = useDispatch();
  const [refStatus, setRefStatus] = useState(false);
  const [connectInfo, setConnectInfo] = useState({
    isConnected: false,
    wallet: '',
    balance: 0
  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const homeSection = useScrollSection('dashnav-section');
  const buySection = useScrollSection('mint-nft-section');
  const roadmapSection = useScrollSection('roadmap-section');

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
      }
    });
    addWalletListener();
    return () => {
      window.removeEventListener("scroll", scrollCallBack);
    };
  }, [dispatch]);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          setRefStatus(prevState => !prevState);
          const data = await getBalance();
          if (data.success) {
            setConnectInfo({ ...connectInfo, isConnected: true, wallet: accounts[0], balance: Number(data.balance) });
          }
        } else {
          setConnectInfo({ isConnected: false, wallet: '', balance: 0 });
        }
      });
      window.web3.eth.getAccounts(async function (err, accounts) {
        if (accounts.length > 0) {
          const data = await getBalance();
          if (data.success) {
            setConnectInfo({ ...connectInfo, isConnected: true, wallet: accounts[0], balance: Number(data.balance) });
          }
        }
      });
    }
  }

  async function handleConnect() {
    const data = await connectWallet();
    if (data.status) {
      const resp = await getBalance();
      if (resp.status) {
        setConnectInfo({
          isConnected: true,
          wallet: resp.account,
          balance: Number(resp.balance)
        })
      }
    }
  }

  useEffect(() => {
    dispatch(setWalletState(connectInfo));
  }, [dispatch, connectInfo])

  useEffect(() => {
    dispatch(setRefreshState(refStatus));
  }, [dispatch, refStatus])

  return (
    <header id="myHeader" className='navbar white'>
      <div className='container'>
        <div className='row w-100-nav'>
          <div className='logo px-0'>
            <div className='navbar-title navbar-item'>
              <NavLink to="/">
                {isMobile() ? (
                  <img
                    src="/img/logo_short.png"
                    className="img-fluid"
                    alt="#"
                    width="50"
                  />
                ) : (
                  <img
                    src="/img/logo.png"
                    className="img-fluid"
                    alt="#"
                    width="60"
                  />
                )}
              </NavLink>
              <span className="text-white logo-title xs-hide">ZKEY</span>
            </div>
          </div>
          <BreakpointProvider>
            <Breakpoint l down>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}>
                <div className='navbar-item'>
                  <span onClick={() => {homeSection.onClick(); handleClose();}} selected={homeSection.selected}>
                    HOME
                  </span>
                </div>
                <div className='navbar-item'>
                  <span onClick={() => {buySection.onClick(); handleClose();}} selected={buySection.selected}>
                    BUY
                  </span>
                </div>
              </Popover>
            </Breakpoint>

            <Breakpoint xl>
              <div className='menu'>
                <div className='navbar-item'>
                  <span onClick={homeSection.onClick} selected={homeSection.selected}>
                    HOME
                    <div className='lines'></div>
                  </span>
                </div>
                <div className='navbar-item'>
                  <span onClick={buySection.onClick} selected={buySection.selected}>
                    BUY
                    <div className='lines'></div>
                  </span>
                </div>
              </div>
            </Breakpoint>
          </BreakpointProvider>

          <div className='mainside'>
            <div className='connect-wal'>
              {
                !connectInfo.isConnected ? (
                  <button className="btn-main lead round-button" onClick={handleConnect}>Connect Wallet</button>
                ) : (
                  <span>{connectInfo.wallet && (connectInfo.wallet.slice(0, 6) + "..." + connectInfo.wallet.slice(38))}</span>
                )
              }
            </div>
          </div>
        </div>

        <button className="nav-icon" onClick={handleClick}>
          <div className="menu-line white"></div>
          <div className="menu-line1 white"></div>
          <div className="menu-line2 white"></div>
        </button>

      </div>
    </header >
  );
}

export default Header;