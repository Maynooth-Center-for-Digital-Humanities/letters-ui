import React, {Component} from 'react';
import BreadCrumbs from '../components/breadcrumbs';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {WPCustomRestPath,domain} from '../common/constants.js';
import {NormalizeWPURL} from '../helpers/helpers.js';
import {Link} from 'react-router-dom';
import Parser from 'html-react-parser';

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
    axios.get(WPCustomRestPath+"post", {
        params: {
          "slug": slug
        }
      })
  	  .then(function (response) {
        let pageData = response.data;
        if (response.statusText==="OK") {
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

  cleanContentURLs(content) {
    let newContent;
    if (typeof content !=="undefined" && content!=="") {
      newContent = Parser("<div>"+content+"<div>", {
        replace: function(domNode) {
          if (domNode.name==="a") {
            if (typeof domNode.attribs.href!=="undefined") {
              let href = domNode.attribs.href;
              let newHref = NormalizeWPURL(href);
              if (newHref.includes("wp-post")) {
                let text = domNode.children[0].data;

                newHref = newHref.replace(domain, "");
                return <Link to={newHref}>{text}</Link>;
              }
            }
          }
        }
      });
    }
    return newContent;
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
      let cleanContent = this.cleanContentURLs(this.state.content.rendered);
      contentTitle = <span dangerouslySetInnerHTML={{__html:this.state.content.post_title}}></span>;
      contentHTML = cleanContent;
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
