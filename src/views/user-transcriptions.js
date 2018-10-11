import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import BreadCrumbs from '../components/breadcrumbs';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {APIPath, domain} from '../common/constants.js';
import Pagination from '../helpers/pagination.js';
import {loadProgressBar} from 'axios-progress-bar';
import {PreloaderCards,Emptyitemscard} from '../helpers/helpers.js';
import ConfirmModal from '../components/confirm-modal';
import ProtectedPage from '../components/protected-page';

export class UserTranscriptionsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      page: 1,
      current_page: 1,
      temp_page: 1,
      total: 0,
      sort: "desc",
      paginate: 10,
      paginationHTML: [],
      length: 0,
      firstLoad: 1,
      letterName: '',
      showRemoveLetterConfirm:false,
      removeLetterId: 0,
      showBtnDisabledConfirm: false,
      btnDisabledText: ''
    };

    this.updatePage = this.updatePage.bind(this);
    this.updatePaginate = this.updatePaginate.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.updatePageNumber = this.updatePageNumber.bind(this);
    this.pageNumberSubmit = this.pageNumberSubmit.bind(this);
    this.loadItems = this.loadItems.bind(this);
    this.parseItems = this.parseItems.bind(this);
    this.toggleTranscriptionStatus = this.toggleTranscriptionStatus.bind(this);
    this.showRemoveLetterConfirm = this.showRemoveLetterConfirm.bind(this);
    this.hideRemoveLetterConfirm = this.hideRemoveLetterConfirm.bind(this);
    this.removeLetter = this.removeLetter.bind(this);
    this.showBtnDisabledConfirm = this.showBtnDisabledConfirm.bind(this);
    this.hideBtnDisabledConfirm = this.hideBtnDisabledConfirm.bind(this);
  }

  updatePage(e) {
    if (e>0 && e!==this.state.current_page) {
      this.setState({
        loading:true,
        current_page: e,
        temp_page: e,
      });
    }
	}

  updatePaginate(value) {
    if (value!==this.state.paginate) {
      this.setState({
        paginate: value,
        loading: true
      });
    }
  }

  updateSort(value) {
    if (value!==this.state.sort) {
      this.setState({
        sort: value,
        loading: true
      });
    }
  }

  updatePageNumber(e) {
    this.setState({
      temp_page:e.target.value
    });
  }

  pageNumberSubmit(e) {
    e.preventDefault();
    let newPage = this.state.temp_page;
    if (parseInt(newPage,10)!==this.state.current_page) {
      this.setState({
        current_page: newPage,
        loading: true
      });
    }
  }

  loadItems() {
    let context = this;
    let path = APIPath+"user-transcriptions/";
    let params = {
      sort: this.state.sort,
      page: this.state.current_page,
      paginate: this.state.paginate,
    };
    let accessToken = sessionStorage.getItem('accessToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
    axios.get(path, {
      params: params
    })
    .then(function (response) {
      let responseData = response.data.data;
      let itemsData = responseData.data;
      let items = [];
      if (typeof itemsData!=="undefined" && itemsData.length>0) {
        items = context.parseItems(itemsData);
      }
      else items = <Emptyitemscard />;
      // update state
      let currentPage = responseData.current_page;
      if (responseData.last_page<responseData.current_page) {
        currentPage = responseData.last_page;
      }
      context.setState({
        loading:false,
        items: items,
        current_page: currentPage,
        last_page: responseData.last_page,
        total: responseData.total,
        firstLoad: 0
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  parseItems(itemsData) {
    // list of items to display
    let items = [];
    for (let i=0; i<itemsData.length; i++) {
      let item = itemsData[i];
      let element = JSON.parse(item.element);
      let defaultThumbnail;
      if (element.pages.length>0) {
        defaultThumbnail = <img className="list-thumbnail small img-responsive" src={domain+"/diyhistory/archive/square_thumbnails/"+element.pages[0].archive_filename} alt={element.title} />
      }
      let status = item.status;
      let transcription_status = item.transcription_status;
      let cannotEditText = "This letter is currently not available for transcription";
      let linkPath = 'letter-transcribe/'+item.id;
      let removeBtn = <li><button className="action-button" title="Delete letter" onClick={this.showRemoveLetterConfirm.bind(this,item.id, element.title)}>
          <i className="fa fa-times"></i>
        </button></li>;
      let editBtn = <li><Link to={linkPath} className="action-button" title="Edit letter">
        <i className="fa fa-pencil color-blue"></i>
      </Link></li>;
      let rowTitle = <div>
        <Link to={linkPath}>{defaultThumbnail}</Link>
        <h4 className="user-letters-heading">
          <small className="pull-right">{item.created_at}</small>
          <Link to={linkPath}>{element.title}</Link>
        </h4>
      </div>;

      if (status!==0 || transcription_status!==0) {
        editBtn = <li><button className="action-button" title="Edit letter" onClick={this.showBtnDisabledConfirm.bind(this, cannotEditText)}>
          <i className="fa fa-pencil color-grey"></i>
        </button></li>;
        rowTitle = <div>{defaultThumbnail}
          <h4 className="user-letters-heading">
            <small className="pull-right">{item.created_at}</small>
          </h4>
        </div>;
      }

      let viewItem = <li data-id={item.id} key={i} className="img-clearfix">
        <div className="row">
          <div className="col-xs-12 col-sm-8 col-md-9">
            {rowTitle}
          </div>
          <div className="col-sm-4 col-md-3">
            <ul className="action-buttons-list">
              {editBtn}
              {removeBtn}
            </ul>
          </div>
        </div>
      </li>;
      items.push(viewItem);
    }
    return items;
  }

  toggleTranscriptionStatus(id) {
    let context = this;
    let path = APIPath+"update-letter-transcription-status/"+id;
    let accessToken = sessionStorage.getItem('accessToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
    axios({
      method: 'POST',
      url: path,
      crossDomain: true,
    })
    .then(function (response) {
      context.loadItems();
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  showRemoveLetterConfirm(id, title) {
    this.setState({
      showRemoveLetterConfirm: true,
      removeLetterId: id,
      letterName: title
    });
  }

  hideRemoveLetterConfirm() {
    this.setState({
      showRemoveLetterConfirm: false
    });
  }

  removeLetter() {
    let letterId = this.state.removeLetterId;
    if (letterId>0) {
      let context = this;
      let path = APIPath+"remove-transcription-association";
      let accessToken = sessionStorage.getItem('accessToken');
      let arrayData = {
        "id":letterId,
      }
      axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
      axios({
        method: 'DELETE',
        url: path,
        data: arrayData,
        crossDomain: true,
      })
      .then(function (response) {
        context.setState({
          showRemoveLetterConfirm: false,
          removeLetterId: 0,
          letterName: '',
        });
        context.loadItems();
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  showBtnDisabledConfirm(text) {
    this.setState({
      showBtnDisabledConfirm: true,
      btnDisabledText: text,
    });
  }

  hideBtnDisabledConfirm() {
    this.setState({
      showBtnDisabledConfirm: false,
      btnDisabledText: "",
    });
  }

  componentDidMount() {
    this.loadItems();
    loadProgressBar();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.current_page!==this.state.current_page
    || prevState.paginate!==this.state.paginate
    || prevState.sort!==this.state.sort
    ) {
      this.loadItems();
    }
  }

  render() {

    let breadCrumbsArr = [{label:'My Transcriptions',path:''}];
    let content;
    if (this.state.loading && this.state.firstLoad===1) {
      let items = PreloaderCards(11);
      content = <ul className="browse-items">{items}</ul>;
    }
    else if (this.state.loading && this.state.firstLoad===0){
      content = <ul className="browse-items blur">{this.state.items}</ul>;
    }
    else {
      content = <ul className="browse-items">{this.state.items}</ul>;
    }
    let paginate10Active="",paginate25Active="",paginate50Active="";
    if (this.state.paginate===10) {
      paginate10Active = "active";
    }
    if (this.state.paginate===25) {
      paginate25Active = "active";
    }
    if (this.state.paginate===50) {
      paginate50Active = "active";
    }

    let paginationHTML = <div className="browse-filters">

      <DropdownButton
        title="Limit"
        id="limit-filter"
        >
        <MenuItem key="1" onClick={this.updatePaginate.bind(this,10)} className={paginate10Active}>10</MenuItem>
        <MenuItem key="2" onClick={this.updatePaginate.bind(this,25)} className={paginate25Active}>25</MenuItem>
        <MenuItem key="3" onClick={this.updatePaginate.bind(this,50)} className={paginate50Active}>50</MenuItem>
      </DropdownButton>

      <Pagination
          paginate={this.state.paginate}
          current_page={this.state.current_page}
          total_pages={this.state.last_page}
          pagination_function={this.updatePage} />

      <form onSubmit={this.pageNumberSubmit} className="pagination-form">
        <div className="input-group input-group-sm go-to-page">
          <input className="form-control" name="go-to-page" onChange={this.updatePageNumber} value={this.state.temp_page}/>
          <span className="input-group-addon">/ {this.state.last_page}</span>
          <span className="input-group-btn">
            <button type="submit" className="btn btn-default btn-flat"><i className="fa fa-chevron-right"></i></button>
          </span>
        </div>
      </form>

    </div>;

    let contentHTML = <div>
      {paginationHTML}
      <div className="list-items-container">
        {content}
      </div>      
      {paginationHTML}
    </div>;
    let sessionActive = sessionStorage.getItem('sessionActive');
    if (sessionActive!=='true') {
      contentHTML = <div className="item-container">
        <ProtectedPage
          loginModalOpen={this.props.loginModalOpen}
          />
        </div>;
    }
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <h2>My Transcriptions</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            {contentHTML}
          </div>
        </div>

        <ConfirmModal
          headerText="Delete letter"
          bodyText={"The letter \""+this.state.letterName+"\" will be removed from your list of transcriptions. Continue?"}
          buttonCancel={<button type="button" className="pull-left btn btn-primary btn-sm" onClick={this.hideRemoveLetterConfirm}>Cancel</button>}
          buttonSuccess={<button type="button" className="btn btn-danger btn-sm" onClick={this.removeLetter}><i className="fa fa-times"></i> Remove</button>}
          showModal={this.state.showRemoveLetterConfirm}
        />

        <ConfirmModal
          headerText="Notice"
          bodyText={<div className="text-center">{this.state.btnDisabledText}</div>}
          buttonCancel={<div className="text-center"><button type="button" className="btn btn-primary btn-sm" onClick={this.hideBtnDisabledConfirm}>Dismiss</button></div>}
          buttonSuccess=""
          showModal={this.state.showBtnDisabledConfirm}
        />
      </div>
    );
  }
}
