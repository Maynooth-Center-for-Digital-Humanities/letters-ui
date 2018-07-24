import React from 'react';
import axios from 'axios';
import {APIPath} from '../common/constants.js';

export default class NewsletterSubscribe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      loader: false,
      subscribeResponse: '',
      subscribeResponseHidden: true,
    }

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleEmailChange(event) {
    const target = event.target;
    const value = target.value;

    this.setState({
      email: value
    });
  }

  handleFormSubmit(event) {
		event.preventDefault();
    this.setState({
      loader: true
    });
		let context = this;

    axios.post(APIPath+'subscribe-to-newsletter', {
      email: this.state.email.trim(),
    })
	  .then(function (response) {
      let responseMessage = response.data.message;
      let subscribeResponse = "";
      if (responseMessage.status==="subscribed") {
        subscribeResponse = "Thank you for subscribing to our mailing list!";
      }
      context.setState({
        subscribeResponse: subscribeResponse,
        subscribeResponseHidden: false,
        formHiddenClass: true,
        loader:false
      });
      setTimeout(function() {
        context.setState({
          subscribeResponse: '',
          subscribeResponseHidden: true,
          formHiddenClass: false
        });
      },2000);
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
  }

  render() {
    let subscribeResponseHiddenClass = " hidden";
    let formHiddenClass = "";
    if (!this.state.subscribeResponseHidden) {
      subscribeResponseHiddenClass = "";
      formHiddenClass = " hidden";
    }
    let loader = '';
    if (this.state.loader) {
      loader = <i className="fa fa-circle-o-notch fa-spin"></i>;
    }
    return (
      <div className="newsletter-subscribe-footer">
        <div className={"newsletter-subscribe-response"+subscribeResponseHiddenClass}>{this.state.subscribeResponse}</div>
        <form onSubmit={this.handleFormSubmit} className={formHiddenClass}>
          <div className="input-group input-group-sm">
            <input name="email" type="email" className="form-control" placeholder="Email Address" value={this.state.email} onChange={this.handleEmailChange} />
            <span className="input-group-btn">
              <button type="submit" className="btn btn-letters btn-flat">Subscribe {loader}</button>
            </span>
          </div>
        </form>
      </div>
    );
  }
}
