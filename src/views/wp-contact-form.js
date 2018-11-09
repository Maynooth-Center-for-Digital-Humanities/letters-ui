import React, {Component} from 'react';
import BreadCrumbs from '../components/breadcrumbs';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {WPCustomRestPath} from '../common/constants.js';
import {loadReCaptcha} from 'react-recaptcha-google'
import {ReCaptcha} from 'react-recaptcha-google'

export class ContactFormView extends Component {
  constructor() {
    super();
    this.state = {
      name:'',
      email: '',
      subject: '',
      message: '',
      form_error: '',
			form_error_class: 'error-container',
      response_text: '',
      form_status: true,
      disabled: 'disabledg',
      response: [],
      buttonTxt: <span>Send <i className="fa fa-send-o"></i></span>,
      recaptchaLoaded: false
    }
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
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
    if (this.formSubmitErrorCheck()===true) {
      return false;
    }
    let arrayPost = {
      "name": this.state.name,
      "email": this.state.email,
      "subject": this.state.subject,
      "message": this.state.message,
      "recaptchaResponse": this.state.recaptchaResponse
    }
    this.setState({
      buttonTxt: <span>Sending... <i className="fa fa-send-o"></i> <i className="fa fa-spin fa-circle-o-notch"></i></span>
    });
		let context = this;
		axios.post(WPCustomRestPath+"contact-form", arrayPost)
	  .then(function (response) {
      let data = response.data;
      if (data===true) {
        context.setState({
          form_status: false,
          response_text: <div style={{padding: "50px 15px"}}><p>Thank you for contacting us. A member fo the staff will respond shortly.</p></div>,
          buttonTxt: <span>Send success <i className="fa fa-check"></i></span>
        });
      }
      else {
        context.setState({
          form_error: <p>There was an error. Your contact form was not sent. Please try again or send us an email directly at <a href="mailto:letters1916.23@gmail.com">letters1916.23@gmail.com</a></p>,
          form_error_class: 'error-container-visible',
          buttonTxt: <span>Send error <i className="fa fa-times"></i></span>
        });
      }
      setTimeout(function() {
        context.setState({
          buttonTxt: <span>Send <i className="fa fa-send-o"></i></span>
        })
      }, 2000);
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
  }

  formSubmitErrorCheck() {
    let error = false;
    let emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if(this.state.name.trim().length<3) {
      this.setState({
        form_error: 'Your name must contain at least four (4) characters',
  			form_error_class: 'error-container-visible',
      });
      error = true;
    }
	  else if (this.state.email.trim().search(emailRegEx)===-1) {
      this.setState({
        form_error: 'Please enter a valid email address',
  			form_error_class: 'error-container-visible',
      });
      error = true;
    }
    else if(this.state.subject.trim().length<3) {
      this.setState({
        form_error: 'Your subject must contain at least four (4) characters',
  			form_error_class: 'error-container-visible',
      });
      error = true;
    }
    else if(this.state.message.trim().length<10) {
      this.setState({
        form_error: 'Your message must contain at least ten (10) characters',
  			form_error_class: 'error-container-visible',
      });
      error = true;
    }
    else {
      error = false;
      this.setState({
        form_error: '',
  			form_error_class: 'error-container',
      });
    }
    return error;
  }

  onLoadRecaptcha() {
    if (this.recaptcha) {
        this.recaptcha.reset();
    }
  }


  verifyCallback(response) {
    this.setState({
      recaptchaResponse: response,
      disabled: ''
    })
  }

  componentDidMount() {
    loadReCaptcha();
    if (this.recaptcha) {
        this.recaptcha.reset();
    }
  }

  render() {
    let contentHTML,contentTitle;
    let breadCrumbsArr = [];
    let pageContent;
    let reCaptcha = <div>
      <ReCaptcha
            ref={(el) => {this.recaptcha = el;}}
            render="explicit"
            size="normal"
            sitekey="6Lfcv3kUAAAAAM--VtGXkN4kgGwyCdEojRyUfh5M"
            onloadCallback={this.onLoadRecaptcha}
            verifyCallback={this.verifyCallback}
        />
        <br/>
      </div>
    if (this.state.loading) {
      pageContent = <div className="loader-container">
          <ReactLoading type='spinningBubbles' color='#738759' height={60} width={60} delay={0} />
          </div>;
    }
    else {
      contentTitle = "Contact Us";
      if (this.state.form_status) {
        contentHTML = <form name='contact-form' onSubmit={this.handleFormSubmit}>
            <div className="row">
              <div className="col-xs-12 col-sm-8">
                <div className={this.state.form_error_class}>{this.state.form_error}</div>
                <div className="form-group">
                  <label>Your name<sup>*</sup></label>
    							<input name="name" type="text" className="form-control" placeholder="Please enter your name" value={this.state.name} onChange={this.handleFormChange} />
    						</div>
                <div className="form-group has-feedback">
                  <label>Your email<sup>*</sup></label>
    							<input name="email" type="email" className="form-control" placeholder="Email" value={this.state.email} onChange={this.handleFormChange} />
    						</div>
                <div className="form-group">
                  <label>Subject</label>
    							<input name="subject" type="text" className="form-control" placeholder="Please enter the subject of your message" value={this.state.subject} onChange={this.handleFormChange} />
    						</div>
                <div className="form-group">
                  <label>Your Message</label>
    							<textarea name="message" className="form-control" rows="10" placeholder="Please enter your message" onChange={this.handleFormChange} value={this.state.message}></textarea>
    						</div>

                {reCaptcha}

                <button disabled={this.state.disabled} type="submit" className="btn btn-primary">{this.state.buttonTxt}</button>
                <br/>
                <div className="text-right">
                  <small><i>Fields marked with an asterisk (*) are mandatory</i></small>
                </div>
              </div>
            </div>

          </form>;
      }
      else contentHTML = this.state.response_text;
      breadCrumbsArr.push({label:contentTitle,path:''});
      pageContent = <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
            <h1>{contentTitle}</h1>
            <div className="item-container">
              {contentHTML}
            </div>
          </div>
        </div>
      </div>
    }
    return (
      <div>
        {pageContent}
      </div>
    );
  }
}
