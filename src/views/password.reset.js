import React, {Component} from 'react';
import BreadCrumbs from '../components/breadcrumbs';
import axios from 'axios';
import {APIPath} from '../common/constants.js';
import {Redirect} from 'react-router-dom';

export class PasswordResetView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      password_confirm: '',
      passwordStrength: 0,
      strengthClass: "",
      strengthLabel: "",
      submitStatus: false,
      error: false,
      errorText: '',
      success: false,
      successText: '',
    }
    // login form binds
		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.errorValidation = this.errorValidation.bind(this);
    this.passwordStrengthCalculate = this.passwordStrengthCalculate.bind(this);
  }

  handleFormChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (name==="password") {
      this.passwordStrengthCalculate(value);
    }

    this.setState({
      [name]: value
    });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if (this.errorValidation()) {
      if (this.state.submitStatus) {
        return false;
      }
      this.setState({
        submitStatus: true
      });
      let context = this;
      let arrayPost = {
        email: this.state.email.trim(),
        password: this.state.password.trim(),
        password_confirmation: this.state.password_confirm.trim(),
        token: this.props.match.params.token,
      }
      axios({
        method: 'POST',
        url: APIPath+'password-reset',
        data: arrayPost,
        crossDomain: true,
      })
  	  .then(function (response) {
  	    let status = response.data.status;
        if (status) {
          context.setState({
            email: '',
            password: '',
            password_confirm: '',
            passwordStrength: 0,
            strengthClass: "",
            strengthLabel: "",
            error: false,
            errorText: '',
            success: true,
            successText: response.data.message,
          });
        }
        else {
          context.setState({
            submitStatus: false,
            error: true,
            errorText: response.data.errors,
            success: false,
            successText: '',
          });
        }
  	  })
  	  .catch(function (error) {
  	    console.log(error);
        context.setState({
          submitStatus: false
        });
  	  });
    }
  }

  errorValidation() {
    let emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (this.state.email.search(emailRegEx) === -1) {
      this.emailInput.focus();
      this.setState({
        error: true,
        errorText: 'Please enter a valid E-mail Address to continue!'
      });
      return false;
    }
    else if (this.state.password.trim().length<5) {
      this.passwordInput.focus();
      this.setState({
        error: true,
        errorText: 'Your new password must contain at least 6 characters'
      });
      return false;
    }
    else if (this.state.password.trim() !== this.state.password_confirm.trim()) {
      this.passwordConfirmInput.focus();
      this.setState({
        error: true,
        errorText: "Password and password confirm don't match. Please try again."
      });
      return false;
    }
    else {
      this.setState({
        error: false,
        errorText: ''
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

  componentDidMount() {

  }

  render() {
    let redirect = [];
    let sessionActive = sessionStorage.getItem('sessionActive');
    if (sessionActive==='true') {
      redirect = <Redirect to='/user-profile' />;
    }
    let breadCrumbsArr=[];
    let contentTitle = "Password Reset";
    breadCrumbsArr.push({label:contentTitle,path:''});
    let errorClass = 'error-container';
    if (this.state.error) {
      errorClass = 'error-container-visible';
    }
    let submitPreloader = [];
    if (this.state.submitStatus) {
      submitPreloader = <i className="fa fa-spin fa-circle-o-notch"></i>;
    }
    let infoText = '';
    if (!this.state.success) {
      infoText = <p>To reset your password please enter the email you provided during registration and your new password below.</p>;
    }
    let form = <div>
      <div className="row">
        <div className="col-xs-12">
          <div className={errorClass}>
            <div dangerouslySetInnerHTML={{__html: this.state.errorText}}></div>
          </div>
        </div>
      </div>
      <form onSubmit={this.handleFormSubmit}>
        <div className="row">
          <div className="col-xs-12 col-sm-4 text-right">
            <label>E-mail</label>
          </div>
          <div className="col-xs-12 col-sm-5">
            <div className="form-group">
              <input className="form-control" name="email" type="email"
                autoComplete="off" placeholder="Enter a valid email address" value={this.state.email} onChange={this.handleFormChange.bind(this)} ref={(input) => { this.emailInput = input; }}/>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-4 text-right">
            <label>Password</label>
          </div>
          <div className="col-xs-12 col-sm-5">
            <div className="form-group">
              <input className="form-control" name="password" type="password"
            autoComplete="off" placeholder="Enter your password" value={this.state.password} onChange={this.handleFormChange.bind(this)} ref={(input) => { this.passwordInput = input; }}/>
            </div>
          </div>
          <div className="col-xs-12 col-sm-3">
            <div style={{paddingRight: "10px"}}>
              <div className={"password-strength"+this.state.strengthClass}>
                <div className={this.state.strengthClass}></div>
                <div className="password-text">{this.state.strengthLabel}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-4 text-right">
            <label>Confirm Password</label>
          </div>
          <div className="col-xs-12 col-sm-5">
            <div className="form-group">
              <input className="form-control" name="password_confirm" type="password" placeholder="Confirm your password"
            autoComplete="off" value={this.state.password_confirm} onChange={this.handleFormChange.bind(this)} ref={(input) => { this.passwordConfirmInput = input; }}/>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 text-center">
            <button type="submit" className="btn btn-letters">Reset My Password {submitPreloader}</button>
          </div>
        </div>
      </form>
    </div>;
    if (this.state.success) {
      form = <div className="row">
        <div className="col-xs-12 text-center" style={{padding: '20px 0'}}>{this.state.successText}</div>
      </div>;
    }
    let contentHTML = <div>
      <div className="row">
        <div className="col-xs-12">
          {infoText}
        </div>
      </div>
      {form}
    </div>;
    return (
      <div className="container">
        {redirect}
        <div className="row">
          <div className="col-xs-12">
            <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
            <h1>{contentTitle}</h1>
            <div className="item-container">{contentHTML}</div>
          </div>
        </div>
      </div>
    );
  }
}
