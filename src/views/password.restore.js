import React, {Component} from 'react';
import BreadCrumbs from '../components/breadcrumbs';
import axios from 'axios';
import {APIPath} from '../common/constants.js';

export class PasswordRestoreView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      submitStatus: false,
      error: false,
      errorText: '',
      success: false,
      successText: '',
    }
    // login form binds
		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if (this.state.submitStatus) {
      return false;
    }
    this.setState({
      submitStatus: false
    });
    let context = this;
    axios.post(APIPath+'password-reset-email', {
			email: this.state.email,
		})
	  .then(function (response) {
	    let status = response.data.status;
      if (status) {
        context.setState({
          email: '',
          submitStatus: true,
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
      context.setState({
        submitStatus: false
      });
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
  }

  componentDidMount() {

  }

  render() {
    let breadCrumbsArr=[];
    let contentTitle = "Password Restore";
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
      infoText = <p>To reset your password please enter below the email you used when you subscribed with Letters 1916-1923.</p>;
    }
    let form = <div className="row">
      <div className="col-xs-12">
        <div className={errorClass}>{this.state.errorText}</div>
      </div>
      <div className="col-xs-12 col-sm-6 col-md-4">
        <form onSubmit={this.handleFormSubmit}>
          <div className="form-group has-feedback">
            <input name="email" type="email" className="form-control" placeholder="Email" value={this.state.email} onChange={this.handleFormChange} />
            <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
          </div>
          <button type="submit" className="btn btn-letters">Reset My Password {submitPreloader}</button>
        </form>
      </div>
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
