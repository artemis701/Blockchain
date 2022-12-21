import './App.css';
import { useState, useEffect } from 'react';
import { Router, Location, Redirect, LocationProvider } from '@reach/router';
import { useMediaQuery } from 'react-responsive';
import ScrollToTopBtn from './components/menu/ScrollToTop';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import Home from './routes/Home';
import Account from './routes/Account';
import Dashboard from './routes/Dashboard';
import AstroICO from './routes/AstroICO';
import Swap from './routes/Swap';
import NFTSavings from './routes/NFTSavings';
// import Resurrection from './routes/Resurrection';
import AdminICO from './routes/Admin/AdminICO';

import Sidebar from './components/App/Sidebar';
import MainHeader from './components/menu/MainHeader';
import { loadWeb3 } from './core/web3';

export const ScrollTop = ({ children, location }) => {
  useEffect(() => window.scrollTo(0, 0), [location])
  return children
}

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id='routerhang'>
        <div key={location.key}>
          <Router location={location}>
            {children}
          </Router>
        </div>
      </div>
    )}
  </Location>
);

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [navSelected, setNavSelected] = useState('');

  const isMobile = useMediaQuery({ maxWidth: '1024px' });

  useEffect(() => {
    window.addEventListener('load', (event) => {
      AOS.init();
      AOS.refresh();
    });
  }, []);

  useEffect(() => {
    const reloadWeb3 = async () => {
        await loadWeb3();
    }
    reloadWeb3();
  }, []);

  return (
    <LocationProvider>
      <div className='app-container relative min-h-screen md:flex' style={{background: `url(/img/main-back.jpg)`}}>
        {/* SIDEBAR NAV */}
        {navSelected !== 'Home' && (
          <Sidebar setIsOpen={setIsOpen} isOpen={isOpen} />
        )}

        {/* THIS IS OUR CONTENT PAGE */}
        <div
          className={`flex-1 text-white min-h-screen flex-col overflow-hidden ${navSelected !== 'Home' ? 'page-content' : ''}`}

        >
          {/* THIS IS OUR HEADER */}
          {navSelected !== 'Home' && (
            <MainHeader setIsOpen={setIsOpen} navSelected={navSelected} />
          )}
          <div
            className='full-height'
            onClick={() => {
              if (isMobile) {
                setIsOpen(false);
              }
            }}
          >
            <PosedRouter>
              <ScrollTop path="/">
                {/* <AstroICO exact path="/" setNavSelected={setNavSelected}>
                  <Redirect to="/" />
                </AstroICO> */}
                <Dashboard exact path="/" setNavSelected={setNavSelected} >
                  <Redirect to="/" />
                </Dashboard>
                <Account path="account" setNavSelected={setNavSelected} />
                <AstroICO path="astro_ico" setNavSelected={setNavSelected} />
                <Swap path="swap" setNavSelected={setNavSelected} />
                <NFTSavings path="nft_savings" setNavSelected={setNavSelected} />
                {/* <Resurrection path="resurrection" setNavSelected={setNavSelected} /> */}
                <AdminICO path="m_control/admin" setNavSelected={setNavSelected} />
              </ScrollTop>
            </PosedRouter>
          </div>
        </div>
        <ScrollToTopBtn />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
        />
      </div>
    </LocationProvider>
  );
}

export default App;
