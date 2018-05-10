import React from 'react';
import BreadCrumbs from '../components/breadcrumbs';
import {domain} from '../common/constants.js';

export default class VizualizationsMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fullScreenBtnClass: "fa-expand",
      fullScreenStatus: 0,
      iframeWidth: "100%",
      iframeHeight: "600",
      containerStyle: []
    }
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

  render() {
    let pageContent, contentHTML,contentTitle;
    let breadCrumbsArr = [];
    let iframe = '<iframe style="border: none;" src="'+domain+':8200/map/index.html" width="'+this.state.iframeWidth+'" height="'+this.state.iframeHeight+'"></iframe>';
    contentTitle = "Map vizualization";
    contentHTML = <div>
      <p>This is a map of the letters where we have the addresses of both the letter creator and recipient. A blue line represents the letter between two people. Zoom in to a region to see individuals, click on the red vertex to display their name.</p>
      <div className="map-container" style={this.state.containerHeight}>
        <i className={"btn btn-white fa toggle-fullscreen "+this.state.fullScreenBtnClass} onClick={this.toggleFullScreen.bind(this)}></i>
       <div dangerouslySetInnerHTML={{__html:iframe}}></div>
      </div>
    </div>;
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
