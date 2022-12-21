import React from 'react';

const Footer = (props) => {
  return (
    <footer className="footer-light" {...props}>
        <div className="subfooter">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="de-flex">
                            <div className="de-flex-col">
                                <span onClick={() => window.open("/", "_self")}>
                                </span>
                            </div>
                            <div className="de-flex-col">
                                <div className="social-icons">
                                    <span onClick={() => window.open("", "_blank")}><i className="fa fa-facebook fa-lg"></i></span>
                                    <span onClick={() => window.open("", "_blank")}><i className="fa fa-twitter fa-lg"></i></span>
                                    <span onClick={() => window.open("", "_blank")}><i className="fa fa-linkedin fa-lg"></i></span>
                                    <span onClick={() => window.open("", "_blank")}><i className="fa fa-telegram fa-lg"></i></span>
                                    <span onClick={() => window.open("", "_blank")}><i className="fa fa-instagram fa-lg"></i></span>
                                    <span onClick={() => window.open("", "_blank")}><i className="fa fa-medium fa-lg"></i></span>
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