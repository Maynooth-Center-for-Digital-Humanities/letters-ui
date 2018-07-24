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
      msg: "",
      isAdmin: this.props.isAdmin,
      prevlocation: '',
      prevlocationpath: '',
      completed: false,
      approved: false,
    };

    this.showPage = this.showPage.bind(this);
    this.updatePages = this.updatePages.bind(this);
    this.updateErrorState = this.updateErrorState.bind(this);
    this.updateTranscriptionPageStatus = this.updateTranscriptionPageStatus.bind(this);
    this.setPageTranscriptionStatus = this.setPageTranscriptionStatus.bind(this);
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
        let newPageStatus = 0;
        if (typeof responseData.pages[0].transcription_status!=="undefined") {
          newPageStatus = parseInt(responseData.pages[0].transcription_status,10);
          context.setPageTranscriptionStatus(newPageStatus);
        }
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
    if (typeof this.props.history.location.prevlocation!=="undefined") {
      this.setState({
        prevlocation: this.props.history.location.prevlocation,
        prevlocationpath: this.props.history.location.prevlocationpath,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isAdmin!==this.props.isAdmin) {
      this.setState({
        isAdmin: this.props.isAdmin,
      })
    }
  }

  showPage(i) {
    let newPage = this.state.pages[i];
    this.setState({
      page: newPage
    });
    let newPageStatus=0;
    if (typeof newPage.transcription_status!=="undefined") {

      newPageStatus = parseInt(newPage.transcription_status,10);
      this.setPageTranscriptionStatus(newPageStatus);
    }
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

  updateTranscriptionPageStatus(status) {
    let archive_filename;
    if (typeof this.state.page.archive_filename!=="undefined") {
      archive_filename = this.state.page.archive_filename;
    }

    let itemId = 0;
    let postPath;
    let context = this;
    if (typeof this.props.match.params.itemId!=="undefined") {
      itemId = this.props.match.params.itemId;
      postPath = APIPath+'update-letter-transcription-page-status/'+itemId;
    }
    else {
      return false;
    }
    let accessToken = sessionStorage.getItem('accessToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
		axios.post(postPath, {
      'archive_filename': archive_filename,
      'transcription_status': status
    })
	  .then(function (response) {
      if (response.data.status===true) {
        let pages = response.data.data;
        let updatedPage = [];
        for (let i=0; i<pages.length; i++) {
          let page = pages[i];
          if (page.archive_filename===archive_filename) {
            updatedPage = page;
          }
        }
        context.setState({
          page: updatedPage
        });
        context.setPageTranscriptionStatus(status);
      }
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
  }

  setPageTranscriptionStatus(status) {
    if (status===0) {
      this.setState({
        completed: false,
        approved: false,
      });
    }
    if (status===1) {
      this.setState({
        completed: true,
        approved: false,
      });
    }
    if (status===2) {
      this.setState({
        completed: true,
        approved: true,
      });
    }

  }

  render() {
    let contentHTML,contentTitle,adminButtons;
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
          if (this.state.isAdmin) {
            let completeButton, approveButton;
            if (!this.state.completed) {
              completeButton = <button className="btn btn-success" onClick={this.updateTranscriptionPageStatus.bind(this,1)}>Open</button>;
            }
            else {
              completeButton = <button className="btn btn-danger disabled"  onClick={this.updateTranscriptionPageStatus.bind(this,0)}>Closed</button>;
            }
            if (!this.state.approved) {
              approveButton = <button className="btn btn-letters" onClick={this.updateTranscriptionPageStatus.bind(this,2)}>Approve</button>
            }
            else {
              approveButton = <button className="btn btn-letters disabled"  onClick={this.updateTranscriptionPageStatus.bind(this,1)}>Approved</button>
            }
            adminButtons = <div className="transcribe-approve-btns">
              {completeButton}
              &nbsp;
              {approveButton}
            </div>;
          }
          contentTitle = this.state.title;
          contentHTML = <div>
            <TranscriptionPagesList pages={this.state.pages} function={this.showPage}/>
            <TranscriptionImageViewer page={this.state.page} />
            <TranscriptionEditor updatePages={this.updatePages} letterId={this.props.match.params.itemId} page={this.state.page} id="letter-edit" error={this.updateErrorState} />
          </div>;
        }
        let breadCrumbsPath = {label:'My transcriptions', path:'/user-transcriptions'};
        if (this.state.prevlocation!=="") {
          breadCrumbsPath = {label: this.state.prevlocation, path: this.state.prevlocationpath}
        }
        breadCrumbsArr.push(breadCrumbsPath);
        breadCrumbsArr.push({label:contentTitle,path:''});
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
                {adminButtons}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
