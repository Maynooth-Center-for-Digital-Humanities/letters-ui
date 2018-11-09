import React, { Component } from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import 'axios-progress-bar/dist/nprogress.css';
import './assets/bootstrap/css/bootstrap.min.css';
import './assets/font-awesome/css/font-awesome.min.css';
import './assets/open-sans/css/open-sans.css';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './App.css';
import {APIPath,basename} from './common/constants.js';
import {Helmet} from "react-helmet";
import {preloadContent} from './helpers/preload-content.js';

// components
import PageHeader from './common/header';
import PageFooter from './common/footer';
import Navbar from './components/navbar';
import ScrollToTop from './components/scrolltotop';
import CookiesConsent from './components/cookies-consent';


// views
import {HomeView} from './views/home.js';
import {SearchView} from './views/search.js';
import {BrowseView} from './views/browse.js';
import {PasswordRestoreView} from './views/password.restore.js';
import {PasswordResetView} from './views/password.reset.js';
import {RegisterView} from './views/register.js';
import {VerifyAccountView} from './views/verify-account.js';
import {ItemView} from './views/item.js';
import {UploadXML} from './views/upload-xml.js';
import {ContentView} from './views/content.js';
import {WPContentView} from './views/wp-content.js';
import {WPCategoryView} from './views/wp-category.js';
import {WPPagesView} from './views/wp-pages.js';
import {BlankView} from './views/blank.js';
import {VizualizationsView} from './views/vizualizations.js';
import {ContactFormView} from './views/wp-contact-form.js';
import {TranscriptionLetterView} from './views/transcription-letter.js';
import {UserProfileView} from './views/user-profile.js';
import {UserLetterView} from './views/user-letter.js';
import {UserLettersView} from './views/user-letters.js';
import {UserTranscriptionsView} from './views/user-transcriptions.js';
import {TranscriptionsDeskView} from './views/transcriptions-desk.js';
import {NotFound} from './views/404.js';

import {checkSessionCookies,sessionCookie,getCookie} from './helpers/helpers.js';

class App extends Component {
  constructor() {
    super();

    this.state={
      isAdmin: false,
      loginModalVisile: false
    }
    this.checkAdminState = this.checkAdminState.bind(this);

    // login modal
    this.loginModalOpen = this.loginModalOpen.bind(this);
    this.loginModalHide = this.loginModalHide.bind(this);
  }

  checkAdminState() {
    let sessionActive = sessionStorage.getItem('sessionActive');
    if (sessionActive) {
      let context = this;
      let accessToken = sessionStorage.getItem('accessToken');
      axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
      axios.get(APIPath+'user-profile')
      .then(function (response) {
        let status = response.data.status;
        if (typeof status!== undefined && status===true) {
          let roles = response.data.data.roles;
          let isAdmin = false;
          for (let i=0;i<roles.length; i++) {
            let role = roles[i];
            if (role.is_admin===1) {
              isAdmin = true;
            }
          }
          context.setState({
            isAdmin: isAdmin
          });
        }
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.status===401) {
            if (getCookie('letterssessionactive')==="true") {
          		sessionStorage.setItem('sessionActive', false);
          		sessionStorage.setItem('accessToken', '');
          		sessionStorage.setItem('userName', '');
          		sessionCookie('', false, '', true);
        			setTimeout(function() {
        				window.location.reload();
        			},2000);
            }
          }
        }
      });
    }
  }

  componentWillMount() {
    checkSessionCookies();
    this.checkAdminState();
  }

  componentDidMount() {
    preloadContent();
  }

  loginModalHide() {
		this.setState({ loginModalVisile: false });
	}

	loginModalOpen() {
		this.setState({ loginModalVisile: true });
	}

  render() {
    return (
      <Router basename={basename}>
        <div className="App">
          <Helmet htmlAttributes={{ lang : "en" }}/>
          <PageHeader
            loginModalVisile={this.state.loginModalVisile}
            loginModalHide={this.loginModalHide}
            loginModalOpen={this.loginModalOpen}
            />
          <Navbar></Navbar>
          <div className="wrapper main-body">
            <Switch>
              <Route exact path="/" component={HomeView}/>
              <Route path="/blank" component={BlankView}/>
              <Route path="/browse" component={BrowseView}/>
              <Route path="/contact-form" component={ContactFormView}/>
              <Route path="/content/:contentName" component={ContentView}/>
              <Route path="/fullsearch/:term" component={SearchView}/>
              <Route path="/fullsearch" component={SearchView}/>
              <Route path="/item/:itemId" component={props=><ItemView
                isAdmin={this.state.isAdmin}
                {...props} />} />
              <Route path="/letter/:letterId" component={props=><ItemView
                isAdmin={this.state.isAdmin}
                {...props} />} />
              <Route path="/letter-transcribe/:itemId" component={props=><TranscriptionLetterView
                isAdmin={this.state.isAdmin}
                loginModalVisile={this.state.loginModalVisile}
                loginModalHide={this.loginModalHide}
                loginModalOpen={this.loginModalOpen}
                {...props} />} />
              <Route path="/password-restore" component={PasswordRestoreView}/>
              <Route path="/password-reset/:token" component={PasswordResetView}/>
              <Route path="/register" component={RegisterView}/>
              <Route path="/verify-account/:activation_code" component={VerifyAccountView}/>
              <Route path="/transcriptions-desk" component={props=><TranscriptionsDeskView
                 loginModalVisile={this.state.loginModalVisile}
                 loginModalHide={this.loginModalHide}
                 loginModalOpen={this.loginModalOpen}
                 {...props} />} />
              <Route path="/upload-xml" component={props=><UploadXML
                  isAdmin={this.state.isAdmin}
                  loginModalVisile={this.state.loginModalVisile}
                  loginModalHide={this.loginModalHide}
                  loginModalOpen={this.loginModalOpen}
                  {...props} />}/>
              <Route path="/user-letter/:letterId" component={props=><UserLetterView
                  isAdmin={this.state.isAdmin}
                  loginModalVisile={this.state.loginModalVisile}
                  loginModalHide={this.loginModalHide}
                  loginModalOpen={this.loginModalOpen}
                  {...props} />} />
              <Route path="/user-letters" component={props=><UserLettersView
                  loginModalVisile={this.state.loginModalVisile}
                  loginModalHide={this.loginModalHide}
                  loginModalOpen={this.loginModalOpen}
                  {...props} />} />
              <Route path="/user-profile" component={props=><UserProfileView
                  loginModalVisile={this.state.loginModalVisile}
                  loginModalHide={this.loginModalHide}
                  loginModalOpen={this.loginModalOpen}
                  {...props} />} />
              <Route path="/user-transcriptions" component={props=><UserTranscriptionsView
                  loginModalVisile={this.state.loginModalVisile}
                  loginModalHide={this.loginModalHide}
                  loginModalOpen={this.loginModalOpen}
                  {...props} />} />
              <Route path="/vizualizations/:type" component={VizualizationsView}/>
              <Route path="/wp-post/:slug" component={WPContentView}/>
              <Route path="/wp-category/:slug" component={WPCategoryView}/>
              <Route path="/wp-page/:slug" component={WPPagesView}/>
              <Route path="/404" component={NotFound}/>
              <Redirect to='/404' />
            </Switch>
          </div>
          <PageFooter/>
          <CookiesConsent/>
          <ScrollToTop/>
        </div>
      </Router>
    );
  }
}

export default App;
