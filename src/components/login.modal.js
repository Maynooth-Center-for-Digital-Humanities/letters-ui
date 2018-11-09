import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Modal, DropdownButton, MenuItem} from 'react-bootstrap';
import {APIPath} from '../common/constants.js';
import {sessionCookie} from '../helpers/helpers';
import {Redirect} from 'react-router-dom'

class LoginModal extends React.Component {
	constructor(props) {
		super(props);

		// login form binds
		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);

		this.state = {
			email: '',
			password: '',
			remember_me: false,
			login_error: '',
			login_error_class: 'error-container',
			redirect: false
		};
	}

/*
loginModalVisile={this.state.loginModalVisile}
loginModalHide={this.loginModalHide}
loginModalOpen={this.loginModalOpen}
*/
	// login form
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
		let rememberMe = this.state.remember_me;
		var loginModalContext = this;
		axios.post(APIPath+'login', {
			email: this.state.email,
			password: this.state.password
		})
	  .then(function (response) {
	    let status = response.data.status;
	    if (typeof status!== undefined && status===true) {
	      sessionStorage.setItem('userName', response.data.data.userName);
	      sessionStorage.setItem('sessionActive', true);
	      sessionStorage.setItem('accessToken', response.data.data.accessToken);
				sessionCookie(response.data.data.userName, true, response.data.data.accessToken, false, rememberMe);
				let windowLocationPathname = window.location.pathname;
				if (windowLocationPathname.includes("verify-account")) {
					document.location.href="/";
				}
	      else {
					window.location.reload();
				}
	    }
	    else {
	      let error = response.data.errors;
				let errorText = "";
	      for (var e in error) {
					errorText = error[e];
	      }
	      loginModalContext.setState({
					login_error:errorText,
					login_error_class:'error-container-visible'
				});
	    }
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
  }

	handleLogout() {
    let accessToken = sessionStorage.getItem('accessToken');
		sessionStorage.setItem('sessionActive', false);
		sessionStorage.setItem('accessToken', '');
		sessionStorage.setItem('userName', '');
		sessionCookie('', false, '', true);
		if (accessToken==="") {
			setTimeout(function() {
				window.location.reload();
			},1000);
		}
		else {
			axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
	    axios.get(APIPath+'logout')
	    .then(function (response) {
				setTimeout(function() {
					window.location.reload();
				},1000);
	    })
	    .catch(function (error) {
				setTimeout(function() {
					window.location.reload();
				},1000);
	      console.log(error);
	    });
		}
	}

	componentDidUpdate() {
		if (this.state.redirect) {
			this.setState({
				redirect: false
			})
		}
	}
	render() {
		var link = "";
		let sessionActive = sessionStorage.getItem('sessionActive');
		if (sessionActive!=='true') {
	    link = (
	      <span className="href-btn" onClick={this.props.loginModalOpen}><i className="fa fa-user-circle"></i> Login/Register</span>
	    );
		}
		else {
			let userName = sessionStorage.getItem("userName");
			let dropdownTitle = <span><i className="fa fa-user-circle"></i> {userName}</span>;
			link = (
				<DropdownButton
					bsSize="small"
					title={dropdownTitle}
					key="user-dropdown"
					id={"session-dropdown"}
				>
					<MenuItem eventKey="1" componentClass={Link} href="/user-profile" to="/user-profile"><i className="fa fa-user"></i> Profile</MenuItem>
					<MenuItem eventKey="2" componentClass={Link} href="/user-letter/0" to="/user-letter/0"><i className="fa fa-file-o"></i> Add new Letter</MenuItem>
					<MenuItem eventKey="3" componentClass={Link} href="/user-letters" to="/user-letters"><i className="fa fa-files-o"></i> My letters</MenuItem>
					<MenuItem eventKey="4" componentClass={Link} href="/user-transcriptions" to="/user-transcriptions"><i className="fa fa-file-text-o"></i> My transcriptions</MenuItem>
					<MenuItem eventKey="5" onClick={this.handleLogout}><i className="fa fa-sign-out"></i> Logout</MenuItem>
				</DropdownButton>
	    );
		}
		let loginErrorHTML = "";
		if (this.state.login_error.length>0) {
			loginErrorHTML = this.state.login_error;
		}
    const modal = (
      <Modal
        show={this.props.loginModalVisile}
        onHide={this.props.loginModalHide}
				bsSize="small">
        <Modal.Header closeButton>
          <Modal.Title><i className="fa fa-user-circle"></i> Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
					<form name="login-form" onSubmit={this.handleFormSubmit}>
						<div className={this.state.login_error_class}>{loginErrorHTML}</div>
						<div className="form-group has-feedback">
							<input name="email" type="email" className="form-control" placeholder="Email" value={this.state.email} onChange={this.handleFormChange} />
							<span className="glyphicon glyphicon-envelope form-control-feedback"></span>
						</div>
						<div className="form-group has-feedback">
			        <input name="password" type="password" className="form-control" placeholder="Password" value={this.state.password} onChange={this.handleFormChange} />
			        <span className="glyphicon glyphicon-lock form-control-feedback"></span>
			      </div>
						<div className="row">
			        <div className="col-xs-8">
			          <div className="checkbox">
			            <label>
										<input name="remember_me" type="checkbox" value={this.state.remember_me} onChange={this.handleFormChange} /> Remember Me
			            </label>
			          </div>
			        </div>
			        <div className="col-xs-4">
			         	<button type="submit" className="btn btn-primary btn-block btn-flat">Sign In</button>
			        </div>
							<div className="col-xs-12">
								<Link to="/password-restore" onClick={this.props.loginModalHide}>I forgot my password</Link><br/>
								<Link to="/register" onClick={this.props.loginModalHide}>Register for a new account</Link>
							</div>
			      </div>
					</form>
        </Modal.Body>
      </Modal>
    );

		let redirectElement;
    if (this.state.redirect===true) {
      redirectElement = <Redirect to='/'/>
    }

		return (
        <li className="admin-menu">
					{redirectElement}
          {link}
          {modal}
        </li>
		);
	}
}

export default LoginModal;
