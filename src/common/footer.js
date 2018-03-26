import React from 'react';
import MULogo from '../assets/images/mu-logo-white-footer.png';
import {Link} from 'react-router-dom';


let date = new Date();
let year = date.getFullYear();
const pageFooter = () => (
  <div className="page-footer">
    <div className="footer-content">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-sm-4 col-md-3 col-lg-3">
            <a href="https://www.maynoothuniversity.ie/" target="_blank" rel="noopener noreferrer">
              <img src={MULogo} alt="Maynooth University" className="img-responsive footer-logo" />
            </a>
          </div>
          <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
            <ul className="footer-menu">
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <a href="http://letters1916.maynoothuniversity.ie/diyhistory" target="_blank" rel="noopener noreferrer">Contribute</a>
              </li>
              <li>
                <a href="http://letters1916.maynoothuniversity.ie/learn" target="_blank" rel="noopener noreferrer">Learn</a>
              </li>
            </ul>
          </div>

          <div className="col-xs-12 col-sm-5 col-md-6 col-lg-6">

            <ul className="footer-social-links">
              <li><a><i className="fa fa-facebook"></i></a></li>
              <li><a><i className="fa fa-twitter"></i></a></li>
              <li><a><i className="fa fa-tumblr"></i></a></li>
              <li><a><i className="fa fa-soundcloud"></i></a></li>
            </ul>

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
