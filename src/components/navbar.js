import React, {Component} from 'react';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import {Navbar, Nav, NavItem, NavDropdown} from 'react-bootstrap';
import {bootstrapUtils} from 'react-bootstrap/lib/utils';
import logoSmall from '../assets/images/logo-stamp-small.png';
import axios from 'axios';
import {WPCustomRestPath} from '../common/constants.js';
import {NormalizeMenuWPURL} from '../helpers/helpers.js';


bootstrapUtils.addStyle(Navbar, "none");

class MainNavbar extends Component {
  constructor() {
    super();
    this.state = {
      fixed: false,
      navItems: [],
      redirectTarget: "",
      redirect: false
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  getItems() {
    if (sessionStorage.getItem("menu_items")!==null && sessionStorage.getItem("menu_items").length>0) {
      let itemsJSON = JSON.parse(sessionStorage.getItem("menu_items"));
      let newContent = itemsJSON.data;
      this.parseJSON(newContent);
    }
    else {
      let context = this;
      axios.get(WPCustomRestPath+"menu/?menu=menu-2018")
    	  .then(function (response) {
          sessionStorage.setItem("menu_items", JSON.stringify(response));
          let newContent = response.data;
          context.parseJSON(newContent);
        })
        .catch(function (error) {
    	    console.log(error);
    	});
    }
  }

  parseJSON(data) {
    let newArray = [];
    for (let i=0; i<data.length; i++) {
      let menuItem = data[i];
      if (menuItem.menu_item_parent==="0") {
        let parent = menuItem;
        let parentId = parseInt(menuItem.ID,10);
        parent['children']=this.getchildren(parentId, data);
        newArray.push(parent);
      }
    }
    this.createMenu(newArray);
  }

  getchildren(parentId, data) {
    let children = [];

    for (let j=0;j<data.length; j++) {
      let childItem = data[j];
      let childItemParentId = parseInt(childItem.menu_item_parent,10);
      if (childItemParentId===parentId) {
        let childItemID = parseInt(childItem.ID,10);
        childItem['children']=this.getchildren(childItemID, data);
        children.push(childItem);
      }
    }
    return children;
  }

  createMenu(data) {
    let navItems = [];
    for (let i=0; i<data.length; i++) {
      let item = data[i];
      let navItem = this.createNavItem(i,item);
      navItems.push(navItem);
    }
    this.setState({
      navItems: navItems
    });
  }

  navTo(url) {
    this.setState({
      redirect: true,
      redirectTarget: url,
    });
  }

  createNavItem(i, item) {
    let navItem;
    let itemURL = NormalizeMenuWPURL(item.url);
    if (item.children.length===0) {
      navItem = <NavItem componentClass={Link} href={itemURL} to={itemURL} key={i}><div dangerouslySetInnerHTML={{__html: item.title}}></div></NavItem>;
    }
    else {
      let menuItemChildren = this.createNavItemChildren(i,item.children);
            navItem = <NavDropdown
              eventKey={i}
              key={i}
              title={item.title}
              id={"nav-dropdown-"+i}
              componentClass={Link}
              onClick={this.navTo.bind(this, itemURL)}
              to={itemURL}
              noCaret>
                {menuItemChildren}
            </NavDropdown>;
    }
    return navItem;
  }

  createNavItemChildren(i,children) {
    let childrenItems = [];
    for (let j=0; j<children.length; j++) {
      let child = children[j];
      let childURL = NormalizeMenuWPURL(child.url);
      let childrenItem;
      if (child.children.length===0) {
        childrenItem = <NavItem componentClass={Link} href={childURL} to={childURL} key={i+"."+j}><div dangerouslySetInnerHTML={{__html: child.title}}></div></NavItem>;
      }
      else {
        let menuItemChildren = this.menuItemChildren(i,child.children);
        childrenItem = <NavDropdown
          key={i+"."+j}
          title={child.title}
          id={"nav-dropdown-"+i+"."+j}
          noCaret
          componentClass={Link}
          onClick={this.navTo.bind(this, childURL)}
          href={childURL}
          >
            {menuItemChildren}
        </NavDropdown>;
      }

      childrenItems.push(childrenItem);
    }
    return childrenItems;
  }

  componentDidMount() {
    this.getItems();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.redirect===false && this.state.redirect===true) {
      this.setState({
        redirect: false,
        redirectTarget: ""
      });
    }
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
    let redirect;
    if (this.state.redirect) {
      redirect = <Redirect push to={this.state.redirectTarget}  />;
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
              {this.state.navItems}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {redirect}
      </div>
    )
  }
}
export default MainNavbar;
