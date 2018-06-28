import React, {Component} from 'react';
import BreadCrumbs from '../components/breadcrumbs';
import axios from 'axios';
import {APIPath} from '../common/constants.js';
import TranscriptionImageViewer from '../components/transcribe/image-viewer';
import TranscriptionPagesList from '../components/transcribe/pages-list';
import TranscriptionEditor from '../components/transcribe/editor-ck';
import ReactLoading from 'react-loading';

export class TranscriptionLetterView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      title: '',
      pages:[],
      page: [],
      containerClass: "container",
      error: false,
      msg: ""
    };

    this.showPage = this.showPage.bind(this);
    this.updatePages = this.updatePages.bind(this);
    this.updateErrorState = this.updateErrorState.bind(this);
  }

  loadItem() {
    let itemId = 0;
    let getPath;
    let context = this;
    if (typeof this.props.match.params.itemId!=="undefined") {
      itemId = this.props.match.params.itemId;
      getPath = APIPath+'letter-transcribe/'+itemId;
    }
    else {
      return false;
    }

    let accessToken = sessionStorage.getItem('accessToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
		axios.get(getPath)
	  .then(function (response) {
      let responseData = response.data.data;
      if (response.data.status===true) {
        context.setState({
          title: responseData.title,
          pages: responseData.pages,
          page: responseData.pages[0],
          loading: false
        });
      }
      else {
        context.setState({
          title: responseData.title,
          error: true,
          msg: response.data.message,
          loading: false
        });
      }
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
  }

  componentDidMount() {
    this.loadItem();
  }

  showPage(i) {
    let newPage = this.state.pages[i];
    this.setState({
      page: newPage
    });
  }

  updatePages(pages) {
    this.setState({
      pages: pages
    });
  }

  updateErrorState(newError) {
    this.setState({
      error: newError.error,
      msg: newError.msg
    });
  }

  render() {
    let contentHTML,contentTitle;
    let sessionActive = sessionStorage.getItem('sessionActive');
    let breadCrumbsArr = [];
		if (sessionActive!=='true') {
      breadCrumbsArr = [{label:'My transcriptions',path:''}];
      contentHTML = <p className="text-center">This is a protected page. <br/>To view this page you must first login or register.</p>
    }
    else {
      if (!this.state.error) {
        if (this.state.loading) {
          contentHTML = <div className="loader-container item-loader">
                <ReactLoading type='spinningBubbles' color='#738759' height={60} width={60}  delay={0} />
              </div>;
        }
        else if (this.state.loading===false) {
          contentTitle = this.state.title;
          contentHTML = <div>
            <TranscriptionPagesList pages={this.state.pages} function={this.showPage}/>
            <TranscriptionImageViewer page={this.state.page} />
            <TranscriptionEditor updatePages={this.updatePages} letterId={this.props.match.params.itemId} page={this.state.page} id="letter-edit" error={this.updateErrorState} />
          </div>;
        }
        breadCrumbsArr = [{label:'My transcriptions', path:'/user-transcriptions'},{label:contentTitle,path:''}];
      }
      else {
        contentTitle = this.state.title;
        breadCrumbsArr = [{label:'My transcriptions', path:'/user-transcriptions'},{label:contentTitle,path:''}];
        contentHTML = <p className="text-center">{this.state.msg}</p>;
      }
    }
    return (
      <div>
        <div className="container" id="transcription-container">
          <div className="row">
            <div className="col-xs-12">
              <BreadCrumbs items={breadCrumbsArr}/>
              <h1><span>{contentTitle}</span></h1>
              <div className="item-container">
                {contentHTML}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
