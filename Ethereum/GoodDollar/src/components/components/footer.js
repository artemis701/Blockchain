import React, { useState } from 'react';
import styled from "styled-components";
import $ from 'jquery';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { isEmpty } from '../../utils';

const Link = styled.a`
  
`;

const Footer = (props) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setEmail(event.target.value);
    setError('');
  }

  const onSubmit = (event) => {
      event.preventDefault();
      if (isEmpty(email)) {
          setError('Please insert a valid email.');
          return;
      }
      $('#form_subscribe').submit();
  }

  return (
    <footer className="footer-light" {...props}>
        <div className="container">
                <div className="row">
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="widget">
                            <h5>Home</h5>
                            <ul>
                                <li><Link href="https://www.gooddollar.org/faq/" target="_blank">What is G$?</Link></li>
                                <li><Link href="https://www.gooddollar.org/get-gooddollar/" target="_blank">Get G$</Link></li>
                                <li><Link href="https://www.gooddollar.org/support-gooddollar/" target="_blank">Support G$</Link></li>
                                <li><Link href='https://www.gooddollar.org/how-gooddollar-works/' target="_blank">How G$ Works</Link></li>
                                <li><Link href="https://www.gooddollar.org/contact/" target="_blank">Contact Us</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="widget">
                            <h5>Resources</h5>
                            <ul>
                                <li><Link href="https://www.gooddollar.org/faq/" target="_blank">FAQ</Link></li>
                                <li><Link href="https://gooddollar.gitbook.io/gooddocs/" target="_blank">Docs</Link></li>
                                <li><Link href="https://www.gooddollar.org/press/" target="_blank">Press</Link></li>
                                <li><Link href="https://www.gooddollar.org/ambassador/" target="_blank">Ambassador Program</Link></li>
                                <li><Link href="https://help.gooddollar.org/" target="_blank">Help Center</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-1">
                        <div className="widget">
                            <h5>Newsletter</h5>
                            <p>Want to keep up with the latest updates on the GoodDollar and global UBI?</p>
                            <iframe title="GoodDollar" name="dummyframe" id="dummyframe" style={{display: "none"}}></iframe>
                            <form method="post" action="https://go.gooddollar.org/form/submit?formId=18" className="row form-dark" id="form_subscribe" name="form_subscribe" target="dummyframe" onSubmit={onSubmit}>
                                <div className="col text-center">
                                    <input type="email" className="form-control" id="txt_subscribe" name="mauticform[email]" placeholder="enter your email" value={email} onChange={handleChange}/> 
                                    <input type="hidden" name="mauticform[formId]" id="mauticform_blognewslettersubscription_id" value="18" />
                                    <input type="hidden" name="mauticform[return]" id="mauticform_blognewslettersubscription_return" value="https://www.gooddollar.org/press/" />
                                    <input type="hidden" name="mauticform[formName]" id="mauticform_blognewslettersubscription_name" value="blognewslettersubscription" />
                                    <input type="hidden" name="mauticform[messenger]" id="mauticform_blognewslettersubscription_messenger" value="1" />
                                    <button id="btn-subscribe" type="submit">
                                      <i className="arrow_right bg-color-secondary"></i>
                                    </button>
                                    <div className="clearfix"></div>
                                </div>
                                {error ? (
                                    <small className='text-white mt-1 mx-3'>
                                        <WarningAmberIcon fontSize="" /> {error}
                                    </small>
                                ) : (
                                    <small className='mt-1 mx-3'>Your email is safe with us.</small>
                                )}
                                
                            </form>
                            <div className="spacer-10"></div>
                            
                        </div>
                    </div>
                </div>
            </div>
        <div className="subfooter">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="de-flex">
                            <div className="de-flex-col">
                                <span onClick={() => window.open("/", "_self")}>
                                    <img alt="" className="f-logo d-1" src="./img/logo.png" width="167" />
                                    <img alt="" className="f-logo d-3" src="./img/logo-2-light.png" width="167" />
                                    <img alt="" className="f-logo d-4" src="./img/logo-3.png" width="167" />
                                    <span className="copy">&copy; Copyright 2022 - DAPP by GoodDollar</span>
                                </span>
                            </div>
                            <div className="de-flex-col">
                                <div className="social-icons">
                                    <span onClick={() => window.open("https://www.facebook.com/gooddollarorg/", "_blank")}><i className="fa fa-facebook fa-lg"></i></span>
                                    <span onClick={() => window.open("https://twitter.com/gooddollarorg", "_blank")}><i className="fa fa-twitter fa-lg"></i></span>
                                    <span onClick={() => window.open("https://www.linkedin.com/company/gooddollarorg", "_blank")}><i className="fa fa-linkedin fa-lg"></i></span>
                                    <span onClick={() => window.open("https://t.me/GoodDollarX", "_blank")}><i className="fa fa-telegram fa-lg"></i></span>
                                    <span onClick={() => window.open("https://www.instagram.com/gooddollarorg/", "_blank")}><i className="fa fa-instagram fa-lg"></i></span>
                                    <span onClick={() => window.open("https://medium.com/gooddollar", "_blank")}><i className="fa fa-medium fa-lg"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
)};
export default Footer;