import React from 'react';
import BreadCrumbs from '../components/breadcrumbs';
import {WPCustomRestPath,domain} from '../common/constants.js';
import axios from 'axios';
import Parser from 'html-react-parser';
import domToReact from 'html-react-parser/lib/dom-to-react';
import {NormalizeWPURL} from '../helpers/helpers.js';
import TilesGallery from '../components/wp-tiles-gallery';
import {Link} from 'react-router-dom';

export default class VizualizationsGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fullScreenBtnClass: "fa-expand",
      fullScreenStatus: 0,
      iframeWidth: "100%",
      iframeHeight: "600",
      containerStyle: [],
      content: []
    }

    this.getPage = this.getPage.bind(this);
    this.toggleFullScreen = this.toggleFullScreen.bind(this);
    this.cancelFullScreen = this.cancelFullScreen.bind(this);
    this.requestFullScreen = this.requestFullScreen.bind(this);
    this.requestFullScreen = this.requestFullScreen.bind(this);
    this.cleanContentURLs = this.cleanContentURLs.bind(this);
  }

  getPage() {
    let context = this;
    axios.get(WPCustomRestPath+"post", {
        params: {
          "slug": "letter-network"
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

  toggleFullScreen() {
    if (parseInt(this.state.fullScreenStatus,10)===0) {
      let containerHeight = {
        position: "fixed",
        left: "0",
        top: "0",
        right: "0",
        bottom: "0",
        zIndex: "999"
      }
      this.requestFullScreen(document.body);
      this.setState({
        fullScreenBtnClass: "fa-compress",
        fullScreenStatus: 1,
        containerHeight: containerHeight
      });
    }
    else {

      this.cancelFullScreen(document);
      this.setState({
        fullScreenBtnClass: "fa-expand",
        fullScreenStatus: 0,
        containerHeight: [],
        iframeHeight: "600"
      });
    }
  }

  cancelFullScreen(el) {
  	let requestMethod = el.cancelFullScreen||el.webkitCancelFullScreen||el.mozCancelFullScreen||el.exitFullscreen;
  	if (requestMethod) {
  		requestMethod.call(el);
  	}
  	return false;
  }

  requestFullScreen(el) {
  	let requestMethod = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (requestMethod) {
  		requestMethod.call(el);
  	}
    let context = this;
    setTimeout(function() {
      context.setState({
        iframeHeight: window.innerHeight
      });
    },1000);
  	return false;
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
                              caption: <a className="btn btn-letters btn-block btn-flat" href={url} target="_blank" rel="noopener noreferrer">More...</a>,
                              thumbnailCaption: <a className="btn btn-letters btn-block btn-flat" href={url} target="_blank" rel="noopener noreferrer">More...</a>,
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

  componentWillMount() {
    this.getPage();
  }

  render() {
    let pageContent;
    let wpText = this.cleanContentURLs(this.state.content.rendered);
    let contentTitle = this.state.content.post_title;
    let breadCrumbsArr = [];
    let iframe = '<iframe style="border: none;" src="'+domain+'/magellan_vizualizations/graph/index.html" width="'+this.state.iframeWidth+'" height="'+this.state.iframeHeight+'"></iframe>';
    let contentHTML = <div>
      {wpText}
      <div className="map-container" style={this.state.containerHeight}>
        <i className={"btn btn-white fa toggle-fullscreen "+this.state.fullScreenBtnClass} onClick={this.toggleFullScreen.bind(this)}></i>
       <div dangerouslySetInnerHTML={{__html:iframe}}></div>
      </div>
    </div>;
    breadCrumbsArr.push({label:"Visual Exploration",path:'/wp-post/visual-exploration'});
    breadCrumbsArr.push({label:contentTitle,path:''});
    pageContent = <div className="container">
      <div className="row">
        <div className="col-xs-12">
          <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
          <h1>{contentTitle}</h1>
          <div className="item-container">
            {contentHTML}
          </div>
        </div>
      </div>
    </div>;
    return (
      <div>
        {pageContent}
      </div>
    );
  }
}
