import axios from 'axios';
import LoginModal from '../components/login.modal.js';

var APIPath = "http://localhost:8008/api/";


function Login(useremail,password) {
  axios.get(APIPath+'login?email='+useremail+'&password='+password)
  .then(function (response) {
    console.log(response);
    let status = response.data.status;
    if (typeof status!== undefined && status===true) {
      sessionStorage.setItem('active', true);
      sessionStorage.setItem('accessToken', response.data.data.accessToken);
      window.location.reload();
    }
    else {
      let error = response.data.errors;
      let errorHTML = "<ol>\n";
      for (var e in error) {
        errorHTML += "  <li>"+error[e]+"</li>\n";
      }
      errorHTML += "</ol>\n";
      LoginModal.setState('login_error', errorHTML);
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

export default Login;
