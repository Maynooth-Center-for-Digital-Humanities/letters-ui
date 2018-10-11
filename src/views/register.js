import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import BreadCrumbs from '../components/breadcrumbs';
import axios from 'axios';
import {loadProgressBar} from 'axios-progress-bar';
import {APIPath,WPCustomRestPath} from '../common/constants.js';

export class RegisterView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirm: '',
        license_agreement: false,
        subscribe_to_newsletter: false,
      },
      submitStatus: 0,
      errorStatus: false,
      errorMessage: '',
      passwordStrength: 0,
      strengthClass: "",
      strengthLabel: "",
      showResponse: false,
      responseText: '',
      licenseAgreementText: '',
      subscribeToNewsletterText: '',
    }
    this.loadRights = this.loadRights.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.passwordStrengthCalculate = this.passwordStrengthCalculate.bind(this);
  }

  loadRights() {
    let context = this;
    // load rights from wordpress
    axios.get(WPCustomRestPath+"post", {
        params: {
          "slug": "terms-and-conditions-all-users"
        }
      })
  	  .then(function (response) {
        let pageData = response.data;
        if (response.statusText==="OK") {
          let newLicenseAgreementText = <div dangerouslySetInnerHTML={{__html:pageData.rendered}} />
          context.setState({
            licenseAgreementText: newLicenseAgreementText,
          });
        }
      })
      .catch(function (error) {
  	    console.log(error);
  	});

    axios.get(WPCustomRestPath+"post", {
        params: {
          "slug": "newsletter-subscription"
        }
      })
  	  .then(function (response) {
        let pageData = response.data;
        if (response.statusText==="OK") {
          let newSubscribeToNewsletterText = <div dangerouslySetInnerHTML={{__html:pageData.rendered}} />
          context.setState({
            subscribeToNewsletterText: newSubscribeToNewsletterText,
          });
        }
      })
      .catch(function (error) {
  	    console.log(error);
  	});
  }

  handleChange(e) {
    let target = e.target;
    let name = target.name;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let newState = Object.assign({}, this.state);
    newState.form[name]=value;
    if (name==="password") {
      this.passwordStrengthCalculate(value);
    }
    this.setState({
      newState
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.errorValidation()===true) {
      if (this.state.submitStatus) {
        return false;
      }
      this.setState({
        submitStatus: true,
      });
      let arrayPost = {
        name: this.state.form.name.trim(),
        email: this.state.form.email.trim(),
        password: this.state.form.password.trim(),
        password_confirmation: this.state.form.password_confirm.trim(),
        license_agreement: this.state.form.license_agreement,
        subscribe_to_newsletter: this.state.form.subscribe_to_newsletter,
      }
      let context = this;
      axios({
        method: 'POST',
        url: APIPath+'register',
        data: arrayPost,
        crossDomain: true,
      })
  	  .then(function (response) {
        context.setState({
          submitStatus: false,
          showResponse: true,
          responseText: response.data.message
        });

  	  })
  	  .catch(function (error) {
        let responseData = error.response.data;
        let message = "";
        for (let k in responseData.errors) {
          message = responseData.errors[k];
        }
        if (message==="") {
          message = responseData.message;
        }
        context.setState({
          submitStatus: false,
          errorStatus: true,
          errorMessage: message,
        });
  	  });
    }
  }

  componentDidMount() {
    loadProgressBar();
    this.loadRights();
  }

  errorValidation() {
    let emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (this.state.form.name.trim().length===0) {
      this.nameInput.focus();
      this.setState({
        errorStatus: true,
        errorMessage: 'Please enter your Full Name to continue!'
      });
      return false;
    }
    else if (this.state.form.email.search(emailRegEx) === -1) {
      this.emailInput.focus();
      this.setState({
        errorStatus: true,
        errorMessage: 'Please enter a valid E-mail Address to continue!'
      });
      return false;
    }
    else if (this.state.form.password.trim().length<5) {
      this.passwordInput.focus();
      this.setState({
        errorStatus: true,
        errorMessage: 'Your new password must contain at least 6 characters'
      });
      return false;
    }
    else if (this.state.form.password.trim() !== this.state.form.password_confirm.trim()) {
      this.passwordInput.focus();
      this.setState({
        errorStatus: true,
        errorMessage: "Password and password confirm don't match. Please try again."
      });
      return false;
    }
    else if (this.state.form.license_agreement===false) {
      this.licenceAgreementInput.focus();
      this.setState({
        errorStatus: true,
        errorMessage: "You must accept the license agreement to continue."
      });
      return false;
    }
    else {
      this.setState({
        errorStatus: false,
        errorMessage: ''
      });
    }
    return true;
  }

  passwordStrengthCalculate(value) {
    let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
    let mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    let strengthClass = "";
    let strengthLabel = "";
    if (value.trim().length>0) {
      if(strongRegex.test(value)) {
          strengthClass = " green";
          strengthLabel = "Strong";
      } else if(mediumRegex.test(value)) {
          strengthClass = " orange";
          strengthLabel = "Medium";
      }
      else {
        strengthClass = " red";
        strengthLabel = "Weak";
      }
    }
    this.setState({
      strengthClass: strengthClass,
      strengthLabel: strengthLabel
    });
  }

  render() {
    let contentHTML,contentTitle,pageContent;
    let breadCrumbsArr = {label:contentTitle, path:''};
    let sessionActive = sessionStorage.getItem('sessionActive');
    let redirect = [];
		if (sessionActive==='true') {
      redirect = <Redirect to={{
        pathname: '/user-profile',
      }} />
    }
    else {
      let submitPreloader = [];
      if (this.state.submitStatus) {
        submitPreloader = <i className="fa fa-spin fa-circle-o-notch"></i>;
      }
      contentTitle = 'User registration';
      if (this.state.showResponse) {
        contentHTML = <div className="row">
          <div className="col-xs-12">
            <p className="text-center">{this.state.responseText}</p>
          </div>
        </div>
      }
      else {
        let errorClass = "error-container";
        if (this.state.errorStatus) {
          errorClass = "error-container-visible";
        }
        contentHTML = <div className="row">
          <div className="col-xs-12 col-sm-12">
            <p className="text-center">Please complete the following form to register for a new account with Letters 1916-1923.</p>
            <form name="registration-form" onSubmit={this.handleSubmit}>
              <div className={errorClass}>{this.state.errorMessage}</div>
              <div className="form-group">
                <div className="row">
                  <div className="col-xs-12 col-sm-4 text-right">
                    <label>Name</label>
                  </div>
                  <div className="col-xs-12 col-sm-5">
                    <input className="form-control" name="name" type="text" placeholder="Enter your full name" value={this.state.form.name} onChange={this.handleChange.bind(this)} ref={(input) => { this.nameInput = input; }}/>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="row">
                  <div className="col-xs-12 col-sm-4 text-right">
                    <label>E-mail Address</label>
                  </div>
                  <div className="col-xs-12 col-sm-5">
                    <input className="form-control" name="email" type="email"
                    autoComplete="off" placeholder="Enter a valid email address" value={this.state.form.email} onChange={this.handleChange.bind(this)} ref={(input) => { this.emailInput = input; }}/>
                  </div>
                </div>
              </div>


              <div className="form-group">
                <div className="row">
                  <div className="col-xs-12 col-sm-4 text-right">
                    <label>Password</label>
                  </div>
                  <div className="col-xs-12 col-sm-5">
                    <input className="form-control" name="password" type="password"
                    autoComplete="off" placeholder="Enter your password" value={this.state.form.password} onChange={this.handleChange.bind(this)} ref={(input) => { this.passwordInput = input; }}/>
                  </div>
                  <div className="col-xs-12 col-sm-3">
                    <div className={"password-strength"+this.state.strengthClass}>
                      <div className={this.state.strengthClass}></div>
                      <div className="password-text">{this.state.strengthLabel}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="row">
                  <div className="col-xs-12 col-sm-4 text-right">
                    <label>Confirm Password</label>
                  </div>
                  <div className="col-xs-12 col-sm-5">
                    <input className="form-control" name="password_confirm" type="password" placeholder="Confirm your password"
                    autoComplete="off" value={this.state.form.password_confirm} onChange={this.handleChange.bind(this)} />
                  </div>
                </div>
              </div>

              <hr/>
              <h4>License Agreement</h4>
              <div className="form-group">
                <div className="license-agreement-text">{this.state.licenseAgreementText}</div>
                <label>
                  <input name="license_agreement" type="checkbox" onChange={this.handleChange.bind(this)} ref={(input) => { this.licenceAgreementInput = input; }} /> Accept license agreement</label>
              </div>
              <div className="form-group">
                <div>{this.state.subscribeToNewsletterText}</div>
                <label>
                  <input name="subscribe_to_newsletter" type="checkbox" onChange={this.handleChange.bind(this)} /> Subscribe to newsletter</label>
              </div>
              <button type="submit" className="btn btn-letters">Submit {submitPreloader}</button>
            </form>
          </div>
        </div>;
      }

      pageContent = <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <BreadCrumbs items={breadCrumbsArr} />
            <h1>{contentTitle}</h1>
            <div className="item-container letter-form-container">{contentHTML}</div>
          </div>
        </div>
      </div>
    }
    return (
      <div>
        {redirect}
        {pageContent}
      </div>
    );
  }
}
