import React from 'react';


const Wallet= () => (
  <div className="row">
    <div className="col-lg-3 mb30"></div>
    <div className="col-lg-3 mb30">
        <span className="box-url">
            <span className="box-url-label">Most Popular</span>
            <img src="./img/wallet/1.png" alt="" className="mb20"/>
            <h4>Metamask</h4>
            <p>Start exploring blockchain applications in seconds.  Trusted by over 1 million users worldwide.</p>
        </span>
    </div>
{/* 
    <div className="col-lg-3 mb30">
        <span className="box-url">
            <img src="./img/wallet/2.png" alt="" className="mb20"/>
            <h4>Bitski</h4>
            <p>Bitski connects communities, creators and brands through unique, ownable digital content.</p>
        </span>
    </div>       

    <div className="col-lg-3 mb30">
        <span className="box-url">
            <img src="./img/wallet/3.png" alt="" className="mb20"/>
            <h4>Fortmatic</h4>
            <p>Let users access your Ethereum app from anywhere. No more browser extensions.</p>
        </span>
    </div>     */}

    <div className="col-lg-3 mb30">
        <span className="box-url">
            <img src="./img/wallet/4.png" alt="" className="mb20"/>
            <h4>WalletConnect</h4>
            <p>Open source protocol for connecting decentralised applications to mobile wallets.</p>
        </span>
    </div>
    <div className="col-lg-3 mb30"></div>
</div>
);
export default Wallet;