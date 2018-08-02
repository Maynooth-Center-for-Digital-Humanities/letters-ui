import React from 'react';
import MULogo from '../assets/images/mu-logo-white-footer.png';
import IRCLogo from '../assets/images/IRC_LOGO_White.png';
import SFILogo from '../assets/images/SFI_logo_2017_greyscaled.png';
import NewsletterSubscribe from '../helpers/subscribe-to-newsletter';
import FooterMenu from '../components/footer-menu';

let date = new Date();
let year = date.getFullYear();
const pageFooter = () => (
  <div className="page-footer">
    <div className="footer-content">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-sm-4 col-md-3 col-lg-3 text-left">
            <a href="https://www.maynoothuniversity.ie/" target="_blank" rel="noopener noreferrer">
              <img src={MULogo} alt="Maynooth University" className="img-responsive footer-logo" />
            </a><br/>
            <a href="http://research.ie/" target="_blank" rel="noopener noreferrer">
              <img src={IRCLogo} alt="Irish Research Counsil" className="img-responsive footer-logo" />
            </a><br/>
            <a href="https://www.sfi.ie/" target="_blank" rel="noopener noreferrer">
              <img src={SFILogo} alt="Science Foundation Ireland" className="img-responsive footer-logo" />
            </a>
          </div>
          <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
            <FooterMenu />
          </div>

          <div className="col-xs-12 col-sm-5 col-md-6 col-lg-6">

            <ul className="footer-social-links">
              <li><a><i className="fa fa-facebook"></i></a></li>
              <li><a><i className="fa fa-twitter"></i></a></li>
              <li><a><i className="fa fa-tumblr"></i></a></li>
              <li><a><i className="fa fa-soundcloud"></i></a></li>
            </ul>
            <NewsletterSubscribe />
          </div>
        </div>
      </div>
    </div>

    <div className="footer-rights">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">COPYRIGHT © 2016 - {year} LETTERS 1916-1923.</div>
        </div>
      </div>
    </div>

  </div>
);
export default pageFooter;
