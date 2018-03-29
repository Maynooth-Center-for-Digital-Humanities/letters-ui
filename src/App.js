import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './assets/bootstrap/css/bootstrap.min.css';
import './assets/font-awesome/css/font-awesome.min.css';
import './assets/open-sans/css/open-sans.css';
import './App.css';
import {basename} from './common/constants.js';
import {Helmet} from "react-helmet";
import {preloadContent} from './helpers/preload-content.js';
// components
import PageHeader from './common/header.js';
import PageFooter from './common/footer.js';
import Navbar from './components/navbar.js';
import ScrollToTop from './components/scrolltotop.js';

// views
import {HomeView} from './views/home.js';
import {SearchView} from './views/search.js';
import {BrowseView} from './views/browse.js';
import {PasswordRestoreView} from './views/password.restore.js';
import {RegisterView} from './views/register.js';
import {ItemView} from './views/item.js';
import {ContentView} from './views/content.js';
import {WPContentView} from './views/wp-content.js';
import {BlankView} from './views/blank.js';

class App extends Component {
  componentDidMount() {
    preloadContent();
  }

  render() {
    return (
      <Router basename={basename}>
        <div className="App">
          <Helmet htmlAttributes={{ lang : "en" }}/>
          <PageHeader></PageHeader>
          <Navbar></Navbar>
          <div className="wrapper main-body">
            <Switch>
              <Route exact path="/" component={HomeView}/>
              <Route path="/blank" component={BlankView}/>
              <Route path="/fullsearch/:term" component={SearchView}/>
              <Route path="/fullsearch" component={SearchView}/>
              <Route path="/browse" component={BrowseView}/>
              <Route path="/password-restore" component={PasswordRestoreView}/>
              <Route path="/register" component={RegisterView}/>
              <Route path="/item/:itemId" component={ItemView}/>
              <Route path="/content/:contentName" component={ContentView}/>
              <Route path="/wp-content/:slug" component={WPContentView}/>
            </Switch>
          </div>
          <PageFooter></PageFooter>
          <ScrollToTop></ScrollToTop>
        </div>
      </Router>
    );
  }
}

export default App;
