import React from 'react';
import {getCookie, setCookie} from '../helpers/helpers';

export default class CookiesConsent extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: true
    }
    this.isVisible = this.isVisible.bind(this);
    this.acceptConsent = this.acceptConsent.bind(this);
  }

  isVisible() {
    let accepted = getCookie("l191623_cookies_consent");
    if (accepted==="true") {
      this.setState({
        visible: false
      });
    }
  }

  acceptConsent() {
    let currentDate = new Date();
    let nextMonth = new Date();
    nextMonth.setDate(currentDate.getDate() + 30);
    setCookie("l191623_cookies_consent", "true", nextMonth);
    this.setState({
      visible: false
    });
  }

  componentDidMount() {
    this.isVisible();
  }

  render() {
    let hiddenClass="";
    if (!this.state.visible) {
      hiddenClass = " hidden";
    }
    return(
      <div className={"cookies-consent-container"+hiddenClass}>
        <div className="cookies-consent-content">
          <p>The Letters 1916-23 website uses cookies to ensure the best experience for our visitors. By continuing to use the Letters 1916-23 website you are agreeing to our <a href="/wp-post/letters-1916-1923-cookie-policy">
          <i className="fa fa-question-circle"></i> cookies policy</a></p>

          <button type="button" className="btn btn-letters" onClick={this.acceptConsent}>Accept</button>
        </div>
      </div>
    );
  }
}
