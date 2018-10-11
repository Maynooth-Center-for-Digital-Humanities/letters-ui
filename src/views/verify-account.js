import React, {Component} from 'react';
import BreadCrumbs from '../components/breadcrumbs';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {APIPath} from '../common/constants.js';

export class VerifyAccountView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: false,
      errorMsg: ''
    }
    this.verifyAccount = this.verifyAccount.bind(this);
  }

  verifyAccount() {
    let context = this;
    axios.get(APIPath+'verify-account/'+this.props.match.params.activation_code)
	  .then(function (response) {
      if (response.data.status===true) {
        context.setState({
          loading: false,
          error: false,
          errorMsg: ''
        });
      }
      else if (response.data.status===false) {
        context.setState({
          loading: false,
          error: true,
          errorMsg: response.data.errors
        });
      }


	  })
	  .catch(function (error) {
	    console.log(error);

      context.setState({
        loading: false,
        error: true,
        errorMsg: ''
      });
	  });
  }

  componentDidMount() {
    this.verifyAccount();
  }

  render() {
    let content = <div className="loader-container active-img-loader">
        <ReactLoading type='spinningBubbles' color='#738759' height={60} width={60}  delay={0} />
        </div>;
    if (!this.state.loading) {
      if (!this.state.error) {
        content = <div style={{padding: "30px 0 50px 0"}}>
          <h4>Welcome to Letters 1916-1923!</h4>
          <p>Your new user account has been successfully verified. <br/>
          Please login to start using your new user account.
          </p>
        </div>;
      }
      else {
        content = <div style={{padding: "30px 0 50px 0"}}>
          <h4>Error in verifying user account</h4>
          <p>{this.state.errorMsg}</p>
        </div>;
      }

    }
    let breadCrumbsArr =[{label:'Verify Account',path:''}];
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
            <h1>Verify new User Account</h1>
          </div>
        </div>
        <div className="item-container">
          <div className="row">
            <div className="col-xs-12">
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
