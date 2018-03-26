import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {bootstrapUtils} from 'react-bootstrap/lib/utils';
import logoSmall from '../assets/images/logo-stamp-small.png';


bootstrapUtils.addStyle(Navbar, "none");

class MainNavbar extends Component {
  constructor() {
    super();
    this.state = {
      fixed: false
    };
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    if (window.scrollY>135) {
      this.setState({fixed:true});
    }
    else {
      this.setState({fixed:false});
    }
  }

  render() {
    let fixedClass='';
    if (this.state.fixed) {
      fixedClass = "fixed";
    }
    return (
      <div className={'navbar-container '+fixedClass }>
        <Navbar collapseOnSelect bsStyle="none">
          <Navbar.Header>
            <Navbar.Brand>
              <NavItem componentClass={Link} href="/" to="/"><img src={logoSmall} alt="Letters 1916-1923" /></NavItem>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem componentClass={Link} href="/" to="/">Home</NavItem>
              <NavItem componentClass={Link} href="/content/about" to="/content/about">About</NavItem>
              <NavItem componentClass={Link} href="/fullsearch/" to="/fullsearch/">Search</NavItem>
              <NavItem componentClass={Link} href="/browse" to="/browse">Browse</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
}
export default MainNavbar;
