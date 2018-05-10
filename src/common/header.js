import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../assets/images/logo-update.png';
import LoginModal from '../components/login.modal.js';
import SearchInput from '../components/header-search.js';

const pageHeader = () => (
  <div className="page-header">
    <div className="top-bar">
      <div className="wrapper">
        <div className="container">
          <ul className="pull-left">
            <li><a><i className="fab fa-facebook"></i></a></li>
            <li><a><i className="fab fa-twitter"></i></a></li>
            <li><a><i className="fab fa-tumblr"></i></a></li>
            <li><a><i className="fab fa-soundcloud"></i></a></li>
          </ul>
          <ul className="pull-right">
            <LoginModal></LoginModal>
          </ul>
        </div>
      </div>
    </div>
    <div className="wrapper page-header-wrapper">
      <div className="header-logo-row">
        <div className="col-xs-12 col-sm-8 col-md-8"></div>
        <div className="col-xs-12 col-sm-4 col-md-4 logo-r"></div>
      </div>
      <div className="container header-logo-container">
        <div className="col-xs-12 col-sm-8 col-md-8 logo-l">
          <Link to="/"><img src={logo} className="logo-img img-responsive" alt="Letters 1916-1923" /></Link>
        </div>
        <div className="col-xs-12 col-sm-4 col-md-4 logo-r">
          <SearchInput/>
        </div>
      </div>


    </div>
  </div>
);
export default pageHeader;
