import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import BreadCrumbs from '../components/breadcrumbs';

export class NotFound extends Component {

  render() {
    let breadCrumbsArr =[{label:'Page Not Found',path:''}];
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
            <h1>Page Not Found</h1>
          </div>
        </div>
        <div className="item-container">
          <div className="row">
            <div className="col-xs-12">
              <div style={{padding: "30px 0 50px 0"}}>
                <h3>The requested page does not exist.</h3>
                <p>If you entered a web address please check it was correct.</p>
                <p>You can search through <Link href="/fullsearch" to="/fullsearch">Letters 1916-1923</Link> or go back to our <Link to="/" href="/">homepage</Link>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
