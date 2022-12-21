import React, { useEffect } from 'react';
import Footer from '../components/footer';
import MintHeader from '../components/MintHeader';
import NftHistory from '../components/NftHistory';
import { checkNetwork } from '../../core/web3';

const Mint = () => {
  useEffect(() => {
    async function checkNetworkChain () {
      window.web3.eth.getChainId().then((chainId) => {
        checkNetwork(chainId);
      })
    }
    checkNetworkChain();  
  }, []);
  return (
  <div>
    <section className="container dashnav-container" style={{ marginTop: '85px' }}>
      <MintHeader />
    </section>
    <section className="nft-container" style={{background: `url('img/background/frame_7.png')`}}>
      <div className='row'>
        <div className='col-lg-12'>
          <div className='text-center'>
            <h2>My NFTs</h2>
          </div>
        </div>
      </div>
      <NftHistory />
    </section>
    <Footer />
  </div>
)};
export default Mint;