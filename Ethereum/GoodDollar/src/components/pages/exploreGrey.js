import React from 'react';
import TweetStormExplorer from '../components/TweetStormExplorer';
import Footer from '../components/footer';
import "./style/explorer.scss";

const explore = () => (
  <div className="greyscheme">
    <section className='breadcumb explorer-section no-bg' style={{ background: 'url(/img/sub_header.png)', backgroundSize: 'cover', backgroundPositionY: 'center' }}>
      <div className='mainbreadcumb'>
        <div className='container'>
          <div className='row m-10-hor'>
            <div className='col-12'>
              <h1 className='text-center'>TweetStorm Explorer</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className='container'>
      <TweetStormExplorer />
    </section>
    <Footer />
  </div>

);
export default explore;