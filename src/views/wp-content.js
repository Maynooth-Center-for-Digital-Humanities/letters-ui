import React, {Component} from 'react';
import BreadCrumbs from '../components/breadcrumbs';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {WPRestPath} from '../common/constants.js';

export class WPContentView extends Component {
  constructor() {
    super();
    this.state = {
      loading:true,
      content: []
    }
  }

  getPage() {
    let slug = this.props.match.params.slug;
    let context = this;
    axios.get(WPRestPath+"pages", {
        params: {
          "slug": slug
        }
      })
  	  .then(function (response) {
        let pageData = response.data[0];
        if (response.data.length>0) {
          context.setState({
            content:pageData,
            loading:false
          });
        }
      })
      .catch(function (error) {
  	    console.log(error);
  	});
  }

  componentDidMount() {
    this.getPage();
  }

  render() {
    let contentHTML,contentTitle;
    let breadCrumbsArr = [];
    let pageContent;
    if (this.state.loading) {
      pageContent = <div className="loader-container">
          <ReactLoading type='spinningBubbles' color='#738759' height='60px' width='60px' delay={0} />
          </div>;
    }
    else {
      contentTitle = this.state.content.title.rendered;
      contentHTML = this.state.content.content.rendered;
      breadCrumbsArr.push({label:contentTitle,path:''});
      console.log(breadCrumbsArr);
      pageContent = <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
            <h1>{contentTitle}</h1>
            <div dangerouslySetInnerHTML={{__html: contentHTML}}></div>
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
