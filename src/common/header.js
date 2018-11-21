import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import logo from '../assets/images/logo-update.png';
import LoginModal from '../components/login.modal';
import SearchInput from '../components/header-search';

export default class pageHeader extends Component {
  render() {

    return (
      <div className="page-header">
        <div className="top-bar">
          <div className="wrapper">
            <div className="container">
              <ul className="pull-left social-icons">
                <li><a href='https://www.facebook.com/lettersof1916' target='_blank' rel="noopener noreferrer"><i className="fa fa-facebook"></i></a></li>
                <li><a href='https://twitter.com/Letters1916' target='_blank' rel="noopener noreferrer"><i className="fa fa-twitter"></i></a></li>
                <li><a href='http://letters1916.tumblr.com/' target='_blank' rel="noopener noreferrer"><i className="fa fa-tumblr"></i></a></li>
                <li><a href='https://soundcloud.com/letters-1916' target='_blank' rel="noopener noreferrer"><i className="fa fa-soundcloud"></i></a></li>
                <li><Link to='/wp-post/contact-us-2' href='/wp-post/contact-us-2'><i className="fa fa-envelope"></i></Link></li>
              </ul>
              <ul className="pull-right">
                <LoginModal
                  loginModalVisile={this.props.loginModalVisile}
                  loginModalHide={this.props.loginModalHide}
                  loginModalOpen={this.props.loginModalOpen}
                 />
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
  }
}
