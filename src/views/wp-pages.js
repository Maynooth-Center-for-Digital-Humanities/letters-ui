import React, {Component} from 'react';
import BreadCrumbs from '../components/breadcrumbs';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {WPRestPath} from '../common/constants.js';

export class WPPagesView extends Component {
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.url!==this.props.match.url) {
      this.setState({
        loading:true
      });
      this.getPage();
    }
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
      contentTitle = <span dangerouslySetInnerHTML={{__html:this.state.content.title.rendered}}></span>;
      contentHTML = <div dangerouslySetInnerHTML={{__html: this.state.content.content.rendered}}></div>;
      breadCrumbsArr.push({label:contentTitle,path:''});
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
    return (
      <div>
        {pageContent}
      </div>
    );
  }
}
