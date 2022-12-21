import React from 'react';
import Footer from '../components/footer';
import TweetStormForm from '../components/TweetStormForm';
import "./style/create.scss"

const Create = function () {
  return (
    <div className='greyscheme'>
      <div className='create_container'>
        <section className='container create_form'>
          <div className='row form-center'>
              <TweetStormForm />
          </div>
        </section>
      </div>
      <Footer style={{paddingTop: '220px'}} />
    </div>
  );
}

export default Create;
