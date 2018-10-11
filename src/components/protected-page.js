import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class ProtectedPage extends Component {

  render() {
    return (
      <p className="text-center">This is a protected page.
        <br/>To view this page you must first <button className="btn btn-default btn-xs" onClick={this.props.loginModalOpen}>login</button> or <Link className="btn btn-default btn-xs" to='/register' href='/register'>register.</Link></p>
    )
  }
}
