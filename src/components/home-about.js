import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {WPRestPath} from '../common/constants.js';
import ReactLoading from 'react-loading';

export default class HomeAbout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      about: [],
      loading: true
    };
  }

  stripHTML(html) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText;
  }

  loadAbout() {
    if (sessionStorage.getItem("home_about")!==null && sessionStorage.getItem("home_about").length>0) {
      let about = JSON.parse(sessionStorage.getItem("home_about"));
      this.setState({
        about:about,
        loading: false
      });
    }
    else {
      let context = this;
      axios.get(WPRestPath+"pages", {
          params: {
            "slug": "about-the-project"
          }
        })
    	  .then(function (response) {
          let newData = response.data[0];
          let newTitle = newData.title.rendered;
          let newContent = context.stripHTML(newData.content.rendered);
          newContent = newContent.substring(0,500)+"...";
          let about = {
            title: newTitle,
            content: newContent
          }
          context.setState({
            about:about,
            loading: false
          });
        })
        .catch(function (error) {
    	    console.log(error);
    	});
    }
  }

  componentDidMount() {
    this.loadAbout();
  }

    render() {
      let content;
      if (this.state.loading) {
        content = <div>
            <div className="loader-container">
            <ReactLoading type='spinningBubbles' color='#738759' height='60px' width='60px' delay={0} />
            </div>
          </div>;
      }
      else {
        content = <div>
            <h2>{this.state.about.title}</h2>
            <div dangerouslySetInnerHTML={{__html: this.state.about.content}} className="wrap-text"></div>
            <br/>
            <Link className="btn btn-default" to="/wp-content/about-the-project">Read more...</Link>
          </div>
      }
      return(
        <div>
        {content}
        </div>
      )
    }
}
