import React, { useEffect, useState } from "react";
import Breakpoint, { BreakpointProvider, setDefaultBreakpoints } from "react-socks";
import { useDispatch } from 'react-redux';
import { Link } from '@reach/router';
import Popover from '@mui/material/Popover';
import AvatarRedux from "./AvatarRedux";
import { connectWallet } from '../../core/web3';
import { fetchWalletState } from '../../store/actions/thunks/wallet';

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
  const [showConnect, setShowConnect] = useState(true);
  const [wallet, setWallet] = useState('');

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

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

  useEffect(() => {
    dispatch(fetchWalletState(!showConnect));
  }, [dispatch, showConnect])

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          setShowConnect(false);
          setWallet(accounts[0]);
        } else {
          setShowConnect(true);
        }
      });
      window.web3.eth.getAccounts(function (err, accounts) {
        if (accounts.length > 0) {
          setShowConnect(false);
          setWallet(accounts[0]);
        }
      });
    }
  }

  async function connectWalletFunc() {
    const data = await connectWallet();
    if (data.status) {
      setShowConnect(false);
      setWallet(data.account);
    }
  }

  return (
    <header id="myHeader" className='navbar white'>
      <div className='container'>
        <div className='row w-100-nav'>
          <div className='logo px-0'>
            <div className='navbar-title navbar-item'>
              <NavLink to="/">
                <img
                  src="/img/logo.png"
                  className="img-fluid d-block"
                  alt="#"
                  width="167px"
                />
                <img
                  src="/img/logo-2.png"
                  className="img-fluid d-3"
                  alt="#"
                  width="40px"
                />
                <img
                  src="/img/logo-3.png"
                  className="img-fluid d-4"
                  alt="#"
                  width="167px"
                />
                <img
                  src="/img/logo-light.png"
                  className="img-fluid d-none"
                  alt="#"
                  width="167px"
                />
              </NavLink>
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
                  <NavLink to="/" onClick={handleClose}>
                    HOME
                  </NavLink>
                </div>
                <div className='navbar-item'>
                  <NavLink to="/explorer" onClick={handleClose}>
                    Explorer
                  </NavLink>
                </div>
                <div className='navbar-item'>
                  <NavLink to="/create" onClick={handleClose}>
                    Create
                  </NavLink>
                </div>
              </Popover>
            </Breakpoint>

            <Breakpoint xl>
              <div className='menu'>
                <div className='navbar-item'>
                  <NavLink to="/">
                    Home
                    <span className='lines'></span>
                  </NavLink>
                </div>
                <div className='navbar-item'>
                  <NavLink to="/explorer">
                    Explorer
                    <span className='lines'></span>
                  </NavLink>
                </div>
                <div className='navbar-item'>
                  <NavLink to="/create">
                    Create
                    <span className='lines'></span>
                  </NavLink>
                </div>
              </div>
            </Breakpoint>
          </BreakpointProvider>
          <div className='mainside'>
            <div className='connect-wal'>
              {showConnect ? (
                <button className='btn-main inline lead' onClick={connectWalletFunc}>Connect Wallet</button>
              ) : (
                <div className="text-white">{wallet && (wallet.slice(0, 6) + "..." + wallet.slice(38))}</div>
              )}
            </div>
          </div>
          <AvatarRedux wallet={wallet} />
        </div>

        <button className="nav-icon" onClick={handleClick}>
          <div className="menu-line white"></div>
          <div className="menu-line1 white"></div>
          <div className="menu-line2 white"></div>
        </button>

      </div>
    </header>
  );
}
export default Header;