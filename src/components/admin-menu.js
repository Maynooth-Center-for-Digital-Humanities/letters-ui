import React from 'react';
import {Link} from 'react-router-dom';

export default class AdminMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdmin: false,
      open: false
    }
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isAdmin!==this.props.isAdmin) {
      this.setState({
        isAdmin: this.props.isAdmin,
      })
    }
  }

  toggleOpen() {
    let openStatus = false;
    if (!this.state.open) {
      openStatus = true;
    }
    this.setState({
      open: openStatus
    });
  }

  render() {
    let content = "";
    if (this.state.isAdmin) {
      let openClass = "";
      if (this.state.open) {
        openClass = " open";
      }
      // set active items
      let browseActive="",searchActive="",usersActive="";
      if (window.location.pathname==="/admin/list-items") {
        browseActive = "active";
      }
      if (window.location.pathname==="/admin/search-items") {
        searchActive = "active";
      }
      if (window.location.pathname==="/admin/users") {
        usersActive = "active";
      }
      content = <div>
        <div className={"admin-menu-trigger"+openClass}>
          <a onClick={this.toggleOpen}>
            <span>
              <i className="fa fa-laptop"></i>
            </span>
          </a>
        </div>
        <div className={"admin-menu-container"+openClass}>
          <div className="admin-menu-inner">
            <h4>Admin menu</h4>
            <ul className="admin-menu-items">
              <li className={browseActive}>
                <Link href="/admin/list-transcriptions" to="/admin/list-items">List Items </Link>
              </li>
              <li className={searchActive}>
                <Link href="/admin/list-transcriptions" to="/admin/search-items">Search Items </Link>
              </li>
              <li className={usersActive}>
                <Link href="/admin/users" to="/admin/users">Users</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>;
    }
    return (
      <div>
        {content}
      </div>
    );
  }
}
