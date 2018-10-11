import React, {Component} from 'react';
import BreadCrumbs from '../components/breadcrumbs';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {WPCustomRestPath,domain} from '../common/constants.js';
import {NormalizeWPURL} from '../helpers/helpers.js';
import {Link} from 'react-router-dom';
import Parser from 'html-react-parser';
import domToReact from 'html-react-parser/lib/dom-to-react';
import TilesGallery from '../components/wp-tiles-gallery';

export class WPContentView extends Component {
  constructor() {
    super();
    this.state = {
      loading:true,
      content: [],
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
                if (typeof domNode.children[0]!=="undefined") {
                  if (typeof domNode.children[0].data!=="undefined") {
                    let text = domNode.children[0].data;
                    text = domToReact(domNode.children);
                    newHref = newHref.replace(domain, "");
                    return <Link to={newHref}>{text}</Link>;
                  }
                }
              }
            }
          }
          if (domNode.name==="div") {

            if (typeof domNode.attribs.class!=="undefined") {


              if (domNode.attribs.class.includes("final-tiles-gallery")) {
                if (typeof domNode.children[0].attribs.class!=="undefined") {


                  let galleryItems = [];
                  if(domNode.children[0].attribs.class.includes("ftg-items")) {
                    let items = domNode.children[0];
                    for (let i=0; i<items.children.length; i++) {
                      let item = items.children[i];
                      if (typeof item.attribs.class!=="undefined") {
                        if (item.attribs.class.includes("tile")) {
                          let link = "";
                          let img = "";

                          if (typeof item.children[0]!=="undefined") {

                            if (typeof item.children[0].children[1]!=="undefined") {
                              if (typeof item.children[0].children[1].attribs.class!=="undefined") {


                                if (item.children[0].children[1].attribs.class.includes("ftg-social")) {

                                  link = item.children[0].children[0];
                                  img = link.children[0];
                                }

                                else {
                                  link = item.children[0];
                                  img = link.children[0];
                                }

                              }
                            }


                          }

                          if (typeof img!=="undefined") {
                            let imgWidth = 320;
                            let imgHeight = 120;
                            if (typeof img.attribs.width!=="undefined") {
                               imgWidth = parseInt(img.attribs.width,10);
                            }

                            if (typeof img.attribs.height!=="undefined") {
                               imgHeight = parseInt(img.attribs.height,10);
                            }
                            let url = "";
                            if (typeof link.attribs.href!=="undefined") {
                              url = link.attribs.href;
                            }
                            let newImage = {
                              src:img.attribs.src,
                              thumbnail:img.attribs.src,
                              thumbnailWidth: imgWidth,
                              thumbnailHeight: imgHeight,
                              caption: <a className="btn btn-letters btn-block btn-flat" href={url} target="_blank">More...</a>,
                              thumbnailCaption: <a className="btn btn-letters btn-block btn-flat" href={url} target="_blank">More...</a>,
                              isSelected: false
                            }
                            galleryItems.push(newImage);
                          }

                        }
                      }

                    }

                  }

                  return <div className="grid-gallery">
                    <TilesGallery images={galleryItems} enableImageSelection={false} />
                  </div>;
                }


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
          <ReactLoading type='spinningBubbles' color='#738759' height={60} width={60} delay={0} />
          </div>;
    }
    else {
      let postDate = "";
      let cleanContent = this.cleanContentURLs(this.state.content.rendered);
      contentTitle = <span dangerouslySetInnerHTML={{__html:this.state.content.post_title}}></span>;
      contentHTML = cleanContent;
      if (typeof this.state.content.categories!=="undefined" && this.state.content.categories.length>0) {
        breadCrumbsArr.push({label:this.state.content.categories[0].name,path:'/wp-category/'+this.state.content.categories[0].slug});
      }
      if (this.state.content.post_modified!=="") {
        postDate = <div className="post-date">{this.state.content.post_modified}</div>;
      }
      breadCrumbsArr.push({label:contentTitle,path:''});
      pageContent = <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
            <h1>{contentTitle}</h1>
            <div className="wp-content item-container">
              {postDate}
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
