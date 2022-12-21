import React from 'react';

const footer = () => (
    <footer className="footer-light">
        <div className="subfooter">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="de-flex">
                            <span onClick={() => window.open("", "_self")}>
                                <img alt="" className="f-logo d-1" src="./img/logo.png" width="60" />
                                <span className="text-white logo-title xs-hide">ZKEY</span>
                            </span>
                            <span className="copy">Copyright &copy; 2022 <span className='c-more'>ZKEY</span> All Rights Reserved</span>
                            {/* <div className="de-flex-col">
                                <div className="social-icons">
                                    <span onClick={() => window.open("", "_self")}><i className="fa fa-facebook fa-lg"></i></span>
                                    <span onClick={() => window.open("", "_self")}><i className="fa fa-twitter fa-lg"></i></span>
                                    <span onClick={() => window.open("", "_self")}><i className="fa fa-linkedin fa-lg"></i></span>
                                    <span onClick={() => window.open("", "_self")}><i className="fa fa-pinterest fa-lg"></i></span>
                                    <span onClick={() => window.open("", "_self")}><i className="fa fa-rss fa-lg"></i></span>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);
export default footer;