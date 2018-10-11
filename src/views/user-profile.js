import React, {Component} from 'react';
import BreadCrumbs from '../components/breadcrumbs';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {APIPath} from '../common/constants.js';
import ConfirmModal from '../components/confirm-modal';
import {loadProgressBar} from 'axios-progress-bar';
import {Modal} from 'react-bootstrap';
import {sessionCookie} from '../helpers/helpers';
import ProtectedPage from '../components/protected-page';


export class UserProfileView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      userName: '',
      userEmail: '',
      createdAt: '',
      numLetters: '',
      numTranscriptions: '',
      showUpdateModal: false,
      updateSubmitStatus: false,
      updateName: '',
      updateEmail: '',
      updateErrorShow: false,
      updateErrorMessage: '',
      showPasswordModal: false,
      passwordSubmitStatus: false,
      updatePassword: '',
      updatePasswordConfirm: '',
      passwordErrorShow: false,
      passwordErrorMessage: '',
      strengthClass: '',
      strengthLabel: '',
      forgetMeErrorShow: false,
      forgetMeErrorMessage: '',
      showForgetMeConfirm: false,
    }
    this.loadItem = this.loadItem.bind(this);
    // update user
    this.handleUpdateModalShow = this.handleUpdateModalShow.bind(this);
    this.handleUpdateModalClose = this.handleUpdateModalClose.bind(this);
    this.handleUpdateFormChange = this.handleUpdateFormChange.bind(this);
    this.handleUpdateFormSubmit = this.handleUpdateFormSubmit.bind(this);
    this.updateErrorValidation = this.updateErrorValidation.bind(this);

    // update password
    this.handlePasswordModalShow = this.handlePasswordModalShow.bind(this);
    this.handlePasswordModalClose = this.handlePasswordModalClose.bind(this);
    this.handlePasswordFormChange = this.handlePasswordFormChange.bind(this);
    this.handlePasswordFormSubmit = this.handlePasswordFormSubmit.bind(this);
    this.passwordStrengthCalculate = this.passwordStrengthCalculate.bind(this);
    this.passwordErrorValidation = this.passwordErrorValidation.bind(this);

    // forget me
    this.showForgetMeConfirm = this.showForgetMeConfirm.bind(this);
    this.hideForgetMeConfirm = this.hideForgetMeConfirm.bind(this);
    this.forgetMeSubmit = this.forgetMeSubmit.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

	handleUpdateModalShow() {
		this.setState({
      showUpdateModal: true,
      updateName: this.state.userName,
      updateEmail: this.state.userEmail,
    });
	}
  handleUpdateModalClose() {
    this.setState({ showUpdateModal: false });
	}
  handleUpdateFormChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  handleUpdateFormSubmit(e) {
    e.preventDefault();
    if (this.updateErrorValidation()) {
  		if (this.state.updateSubmitStatus) {
  			return false;
  		}
  		this.setState({
  			updateSubmitStatus: true
  		});
  		var context = this;
      let accessToken = sessionStorage.getItem('accessToken');
      axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
  		axios.post(APIPath+'update-user', {
  			name: this.state.updateName.trim(),
  			email: this.state.updateEmail.trim(),
  		})
  	  .then(function (response) {
  			context.setState({
  				updateSubmitStatus: false,
  				showUpdateModal: false,
          userName: context.state.updateName,
          userEmail: context.state.updateEmail,
  			});
  	  })
  	  .catch(function (error) {
  	    console.log(error);
  	  });
    }
  }
  updateErrorValidation() {
    let emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (this.state.updateName.trim().length===0) {
      this.nameInput.focus();
      this.setState({
        updateErrorShow: true,
        updateErrorMessage: 'Your Full Name cannot be blank!'
      });
      return false;
    }
    else if (this.state.updateEmail.search(emailRegEx) === -1) {
      this.emailInput.focus();
      this.setState({
        updateErrorShow: true,
        updateErrorMessage: 'Please enter a valid E-mail Address to continue!'
      });
      return false;
    }
    else {
      this.setState({
        updateErrorShow: false,
        updateErrorMessage: ''
      });
    }
    return true;
  }

  handlePasswordModalShow() {
    this.setState({
      showPasswordModal: true,
    });
  }
  handlePasswordModalClose() {
    this.setState({
      showPasswordModal: false,
    });
  }
  handlePasswordFormChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    if (name==="updatePassword") {
      this.passwordStrengthCalculate(value);
    }
    this.setState({
      [name]: value
    });}
  handlePasswordFormSubmit(e) {
    e.preventDefault();
    if (this.passwordErrorValidation()) {
  		if (this.state.passwordSubmitStatus) {
  			return false;
  		}
  		this.setState({
  			passwordSubmitStatus: true
  		});
  		var context = this;
      let accessToken = sessionStorage.getItem('accessToken');
      axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
  		axios.post(APIPath+'update-user-password', {
  			password: this.state.updatePassword.trim(),
  			password_confirmation: this.state.updatePasswordConfirm.trim(),
  		})
  	  .then(function (response) {
  			context.setState({
  				passwordSubmitStatus: false,
  				showPasswordModal: false,
          updatePassword: '',
          updatePasswordConfirm: '',
  			});
  	  })
  	  .catch(function (error) {
  	    console.log(error);
  	  });
    }
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
  passwordErrorValidation() {
    if (this.state.updatePassword.trim().length<5) {
      this.passwordInput.focus();
      this.setState({
        passwordErrorShow: true,
        passwordErrorMessage: 'Your new password must contain at least 6 characters'
      });
      return false;
    }
    else if (this.state.updatePassword.trim() !== this.state.updatePasswordConfirm.trim()) {
      this.passwordConfirmInput.focus();
      this.setState({
        passwordErrorShow: true,
        passwordErrorMessage: "Password and password confirm don't match. Please try again."
      });
      return false;
    }
    else {
      this.setState({
        passwordErrorShow: false,
        passwordErrorMessage: ''
      });
    }
    return true;
  }

  showForgetMeConfirm() {
    this.setState({
      showForgetMeConfirm: true
    });
  }
  hideForgetMeConfirm() {
    this.setState({
      showForgetMeConfirm: false
    });
  }

  forgetMeSubmit() {
    let context = this;
    let accessToken = sessionStorage.getItem('accessToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
    axios.get(APIPath+'forget-me')
    .then(function (response) {
      if (response.data.data.status==="error") {
        context.setState({
          forgetMeErrorShow: true,
          forgetMeErrorMessage: response.data.message,
          showForgetMeConfirm: false
        })
      }
      else {
        context.handleLogout();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleLogout() {
    sessionStorage.setItem('sessionActive', false);
    sessionStorage.setItem('accessToken', '');
    sessionStorage.setItem('userName', '');
    sessionCookie('', false, '', true);
    window.location.reload();
	}

  loadItem() {
    let context = this;
    let path = APIPath+"user-profile";
    let accessToken = sessionStorage.getItem('accessToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
    axios.get(path)
    .then(function (response) {
      let responseData = response.data.data;
      context.setState({
        loading: false,
        userName: responseData.name,
        userEmail: responseData.email,
        createdAt: responseData.created_at,
        numLetters: responseData.num_letters,
        numTranscriptions: responseData.num_transcriptions,
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  componentDidMount() {
    this.loadItem();
    loadProgressBar();
  }

  render() {
    let contentHTML,pageContent,userUpdateModal,passwordModal,forgetMeModal;
    let contentTitle = "User profile";
    let breadCrumbsArr = {label:contentTitle, path: ''};
    let sessionActive = sessionStorage.getItem('sessionActive');
		if (sessionActive!=='true') {
      contentHTML = <ProtectedPage
        loginModalOpen={this.props.loginModalOpen}
        />
      pageContent = <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
            <h1>{contentTitle}</h1>
            <div className="item-container">{contentHTML}</div>
          </div>
        </div>
      </div>
    }
    else {
      if (this.state.loading) {
        pageContent = <div className="loader-container">
            <ReactLoading type='spinningBubbles' color='#738759' height={60} width={60} delay={0} />
          </div>;
      }
      else {
        let forgetMeErrorClass = "error-container";
    		if (this.state.forgetMeErrorShow) {
    			forgetMeErrorClass = "error-container-visible";
    		}

    		let updateErrorClass = "error-container";
    		if (this.state.updateErrorShow) {
    			updateErrorClass = "error-container-visible";
    		}
        userUpdateModal = (
          <Modal
            show={this.state.showUpdateModal}
            onHide={this.handleUpdateModalClose}
            bsSize="small"
    				>
            <Modal.Header closeButton>
              <Modal.Title><i className="fa fa-user-circle"></i> Update your information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
    					<form onSubmit={this.handleUpdateFormSubmit}>
    						<div className={updateErrorClass}>{this.state.updateErrorMessage}</div>

    						<div className="form-group">
    							<label>Name</label>
    			        <input name="updateName" type="text" className="form-control" ref={(input) => { this.nameInput = input; }} value={this.state.updateName} onChange={this.handleUpdateFormChange} />
    			      </div>
    						<div className="form-group">
    							<label>E-mail</label>
    							<input name="updateEmail" type="email" className="form-control" ref={(input) => { this.nameInput = input; }} value={this.state.updateEmail} onChange={this.handleUpdateFormChange} />
    						</div>
    						<button className="btn btn-letters" type="submit"><i className="fa fa-save"></i> Submit</button>
    					</form>
            </Modal.Body>
          </Modal>
        );

        let passwordErrorClass = "error-container";
    		if (this.state.passwordErrorShow) {
    			passwordErrorClass = "error-container-visible";
    		}
        passwordModal = (
          <Modal
            show={this.state.showPasswordModal}
            onHide={this.handlePasswordModalClose}
            bsSize="small"
    				>
            <Modal.Header closeButton>
              <Modal.Title>Update your password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
    					<form onSubmit={this.handlePasswordFormSubmit}>
    						<div className={passwordErrorClass}>{this.state.passwordErrorMessage}</div>

    						<div className="form-group">
    							<label>Password</label>
    			        <input name="updatePassword" type="password" className="form-control" ref={(input) => { this.passwordInput = input; }} onChange={this.handlePasswordFormChange} />
    			      </div>
                <div className="form-group">
                  <div className={"password-strength"+this.state.strengthClass}>
                    <div className={this.state.strengthClass}></div>
                    <div className="password-text">{this.state.strengthLabel}</div>
                  </div>
                </div>
    						<div className="form-group">
    							<label>Password confirm</label>
    							<input name="updatePasswordConfirm" type="password" className="form-control" ref={(input) => { this.passwordConfirmInput = input; }} value={this.state.handlePasswordFormChange} onChange={this.handlePasswordFormChange} />
    						</div>
    						<button className="btn btn-letters" type="submit"><i className="fa fa-save"></i> Submit</button>
    					</form>
            </Modal.Body>
          </Modal>
        );
        let newDate = new Date(this.state.createdAt);
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let dateLabel = months[newDate.getUTCMonth()]+" "+newDate.getUTCDate()+", "+newDate.getUTCFullYear();

        forgetMeModal = <ConfirmModal
          headerText="Forget me"
          bodyText="All your personal information will be permanently removed from the system. This action cannot be undone. Continue?"
          buttonCancel={<button type="button" className="pull-left btn btn-primary btn-sm" onClick={this.hideForgetMeConfirm}>Cancel</button>}
          buttonSuccess={<button type="button" className="btn btn-danger btn-sm" onClick={this.forgetMeSubmit}><i className="fa fa-times"></i> Forget me</button>}
          showModal={this.state.showForgetMeConfirm}
        />

        contentHTML = <div className="row">
          <div className="col-xs-12 col-sm-8">
            <h4>Welcome {this.state.userName}</h4>
            <p>
              <a onClick={this.handleUpdateModalShow}>Update user information</a><br/>
              <a onClick={this.handlePasswordModalShow}>Update password</a><br/>
              <a onClick={this.showForgetMeConfirm}>Forget me</a><br/>
            </p>
          </div>
          <div className="col-xs-12 col-sm-4">
            Member since: {dateLabel}<br/>
            Letters added: {this.state.numLetters}<br/>
            Letters transcribed: {this.state.numTranscriptions}<br/>
          </div>
        </div>;

        pageContent = <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
              <h1>{contentTitle}</h1>
              <div className="item-container">
                <div className={forgetMeErrorClass}>{this.state.forgetMeErrorMessage}</div>
                {contentHTML}
              </div>
            </div>
          </div>
        </div>
      }
    }
    return (
      <div>
        {pageContent}
        {userUpdateModal}
        {passwordModal}
        {forgetMeModal}
      </div>
    );
  }
}
