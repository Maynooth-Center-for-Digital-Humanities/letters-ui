import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {WPCustomRestPath} from '../common/constants.js';
import {NormalizeMenuWPURL} from '../helpers/helpers.js';

export default class FooterMenu extends Component {
  constructor() {
    super();
    this.state = {
      navItems: [],
    };
  }

  getItems() {
    if (sessionStorage.getItem("footermenu_items")!==null && sessionStorage.getItem("footermenu_items").length>0) {
      let itemsJSON = JSON.parse(sessionStorage.getItem("footermenu_items"));
      let newContent = itemsJSON.data;
      this.parseJSON(newContent);
    }
    else {
      let context = this;
      axios.get(WPCustomRestPath+"menu/?menu=footer-menu")
    	  .then(function (response) {
          sessionStorage.setItem("footermenu_items", JSON.stringify(response));
          let newContent = response.data;
          context.parseJSON(newContent);
        })
        .catch(function (error) {
    	    console.log(error);
    	});
    }
  }

  parseJSON(data) {
    let navItems = [];
    for (let i=0; i<data.length; i++) {
      let menuItem = data[i];
      let relAttr = "";
      let itemURL = NormalizeMenuWPURL(menuItem.url);
      if (menuItem.target==="_blank") {
        relAttr = "noopener noreferrer";
      }

      let navItem = <li key={i}>
        <Link href={itemURL} to={itemURL} target={menuItem.target} rel={relAttr}>{menuItem.title}</Link>
      </li>;
      navItems.push(navItem);
    }
    this.setState({
      navItems: navItems
    });

  }


  componentDidMount() {
    this.getItems();
  }

  render() {
    return (
      <ul className="footer-menu">
        {this.state.navItems}
      </ul>
    )
  }
}
