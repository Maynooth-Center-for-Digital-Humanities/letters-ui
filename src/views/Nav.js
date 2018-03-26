import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

// views
import {LoadHome} from './Home.js';

const AppNavigation = () => (
  <Router>
    <div>
      <div className="navbar-container">
        <nav className="navbar">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-navigation" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>

            <div className="collapse navbar-collapse" id="main-navigation">
              <ul className="nav navbar-nav">
                <li className="active"><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/topics">Topics</Link></li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
      <div className="wrapper main-body">
        <div className="container">
          <Route exact path="/" component={LoadHome}/>
          <Route path="/about" component={About}/>
          <Route path="/topics" component={Topics}/>
        </div>
      </div>
    </div>
  </Router>
)


const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

const Topics = () => (
  <div>
    <h2>Topics</h2>
  </div>
)

export default AppNavigation
