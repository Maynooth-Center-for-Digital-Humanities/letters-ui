import React from 'react';
import {Modal} from 'react-bootstrap';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {APIPath} from '../common/constants.js';

class LoginModal extends React.Component {
	constructor(props) {
		super(props);

		// modal binds
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);

		// login form binds
		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);

		this.state = {
			email: '',
			password: '',
			remember_me: false,
			login_error: '',
			login_error_class: 'error-container',
			showModal: false,
		};
	}

	handleClose() {
		this.setState({ showModal: false });
	}

	handleShow() {
		this.setState({ showModal: true });
	}

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
		var loginModalContext = this;
		axios.get(APIPath+'login?email='+this.state.email+'&password='+this.state.password)
	  .then(function (response) {
	    let status = response.data.status;
	    if (typeof status!== undefined && status===true) {
	      sessionStorage.setItem('userName', response.data.data.userName);
	      sessionStorage.setItem('sessionActive', true);
	      sessionStorage.setItem('accessToken', response.data.data.accessToken);
	      window.location.reload();
	    }
	    else {
	      let error = response.data.errors;
				let errorText = "";
	      for (var e in error) {
					errorText = error[e];
	      }
	      loginModalContext.setState({login_error:errorText});
	      loginModalContext.setState({login_error_class:'error-container-visible'});
	    }
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
  }

	handleLogout() {
		sessionStorage.setItem('sessionActive', false);
		sessionStorage.setItem('accessToken', '');
		window.location.reload();
	}

	render() {
		var link = "";
		let sessionActive = sessionStorage.getItem('sessionActive');
		if (sessionActive!=='true') {
	    link = (
	      <a onClick={this.handleShow}><i className="fa fa-user-circle"></i> Login/Register</a>
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
					<MenuItem eventKey="2" onClick={this.handleLogout}><i className="fa fa-sign-out"></i> Logout</MenuItem>
				</DropdownButton>
	    );
		}
		let loginErrorHTML = "";
		if (this.state.login_error.length>0) {
			loginErrorHTML = this.state.login_error;
		}
    const modal = (
      <Modal
        show={this.state.showModal}
        onHide={this.handleClose}
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
								<Link to="/password-restore" onClick={this.handleClose}>I forgot my password</Link><br/>
								<Link to="/register" onClick={this.handleClose}>Register for a new account</Link>
							</div>
			      </div>
					</form>
        </Modal.Body>
      </Modal>
    );

		return (
        <li>
          {link}
          {modal}
        </li>
		);
	}
}

export default LoginModal;
