import React, {Component} from 'react';
import BreadCrumbs from '../components/breadcrumbs';
import axios from 'axios';
import {APIPath} from '../common/constants.js';
import TranscriptionImageViewer from '../components/transcribe/image-viewer';
import TranscriptionPagesList from '../components/transcribe/pages-list';
import TranscriptionEditor from '../components/transcribe/editor-ck';
import ReactLoading from 'react-loading';
import ProtectedPage from '../components/protected-page';

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
      transcription_status: -1,
      navDisabled: false,
      selectedPage: 0,
      adminModal: false
    };

    this.showPage = this.showPage.bind(this);
    this.updatePages = this.updatePages.bind(this);
    this.updateErrorState = this.updateErrorState.bind(this);
    this.disableNav = this.disableNav.bind(this);
    this.enableNav = this.enableNav.bind(this);
    this.showAdminModal = this.showAdminModal.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();
    let currentPage = this.state.page;

    let archive_filename;
    if (typeof currentPage.archive_filename!=="undefined") {
      archive_filename = currentPage.archive_filename;
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
      'transcription_status': this.state.transcription_status
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
          page: updatedPage,
          pages: pages,
          adminModal: false
        });
      }
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
  }

  showAdminModal() {
    this.setState({
      adminModal: true
    })
  }
  handleClose() {
    this.setState({
      adminModal: false
    })
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
          transcription_status: responseData.pages[0].transcription_status,
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
    if (typeof this.props.history.location.prevlocation!=="undefined") {
      this.setState({
        prevlocation: this.props.history.location.prevlocation,
        prevlocationpath: this.props.history.location.prevlocationpath,
      });
    }
  }


  disableNav(navDisabled) {
    if (!this.state.navDisabled) {
      this.setState({
        navDisabled: true
      });
    }
  }

  enableNav() {
    if (this.state.navDisabled) {
      this.setState({
        navDisabled: false
      });
    }
  }

  showPage(i) {
    if (!this.state.navDisabled) {
      let newPage = this.state.pages[i];
      this.setState({
        page: newPage,
        selectedPage: i
      });
      let newPageStatus=0;
      if (typeof newPage.transcription_status!=="undefined") {
        newPageStatus = parseInt(newPage.transcription_status,10);
        this.setState({
          transcription_status: newPageStatus
        })
      }
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

  render() {
    let contentHTML,contentTitle;
    let sessionActive = sessionStorage.getItem('sessionActive');
    let breadCrumbsArr = [];
		if (sessionActive!=='true') {
      breadCrumbsArr = [{label:'My transcriptions',path:''}];
      contentHTML = <div>
        <ProtectedPage
          loginModalOpen={this.props.loginModalOpen}
          />
      </div>;
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
            <div className="text-right">
              <a className="btn btn-default btn-xs" target="_blank" href="/wp-post/how-to-transcribe">How to transcribe</a>
            </div>
            <TranscriptionPagesList
              pages={this.state.pages}
              disabled={this.state.navDisabled}
              function={this.showPage}
              selected={this.state.selectedPage}
              />
            <TranscriptionImageViewer
              page={this.state.page} />

            <TranscriptionEditor
              updatePages={this.updatePages}
              letterId={this.props.match.params.itemId}
              page={this.state.page}
              id="letter-edit"
              error={this.updateErrorState}
              disableNav={this.disableNav}
              enableNav={this.enableNav}
              />
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
