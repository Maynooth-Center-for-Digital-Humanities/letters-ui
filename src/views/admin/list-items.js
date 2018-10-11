import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import BreadCrumbs from '../../components/breadcrumbs';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {APIPath, domain} from '../../common/constants.js';
import Pagination from '../../helpers/pagination.js';
import {loadProgressBar} from 'axios-progress-bar';
import {PreloaderCards,Emptyitemscard} from '../../helpers/helpers.js';
import ConfirmModal from '../../components/confirm-modal';

export class ItemsListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      page: 1,
      current_page: 1,
      temp_page: 1,
      total: 0,
      paginate: 10,
      paginationHTML: [],
      length: 0,
      firstLoad: 1,
      letterName: '',
      showDeleteLetterConfirm:false,
      deleteLetterId: 0,
      showBtnDisabledConfirm: false,
      btnDisabledText: '',
      redirect: false,
      transcription_status_filter: null,
      user_filter: null,
      sort_col: 'element->title',
      sort_dir: 'desc',
      sort_key: 1,
      transcription_status: null,
    };

    this.updatePage = this.updatePage.bind(this);
    this.updatePaginate = this.updatePaginate.bind(this);
    this.updateTranscriptionStatus = this.updateTranscriptionStatus.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.updatePageNumber = this.updatePageNumber.bind(this);
    this.pageNumberSubmit = this.pageNumberSubmit.bind(this);
    this.loadItems = this.loadItems.bind(this);
    this.parseItems = this.parseItems.bind(this);
    this.toggleTranscriptionStatus = this.toggleTranscriptionStatus.bind(this);
    this.showDeleteLetterConfirm = this.showDeleteLetterConfirm.bind(this);
    this.hideDeleteLetterConfirm = this.hideDeleteLetterConfirm.bind(this);
    this.deleteLetter = this.deleteLetter.bind(this);
    this.showBtnDisabledConfirm = this.showBtnDisabledConfirm.bind(this);
    this.hideBtnDisabledConfirm = this.hideBtnDisabledConfirm.bind(this);
    this.setSessionStorage = this.setSessionStorage.bind(this);
    this.checkSessionStorage = this.checkSessionStorage.bind(this);
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

  updateTranscriptionStatus(value) {
    if (value!==this.state.transcription_status) {
      this.setState({
        transcription_status: value
      });
    }
  }

  updateSort(value, key) {
   if (value['col']!==this.state.sort_col || value['direction']!==this.state.sort_dir) {
      this.setState({
        sort_col: value['col'],
        sort_dir: value['direction'],
        sort_key: key,
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
    let path = APIPath+"admin/transcriptions-list";
    let params = {
      sort_col: this.state.sort_col,
      sort_dir: this.state.sort_dir,
      page: this.state.current_page,
      paginate: this.state.paginate,
      transcription_status: this.state.transcription_status,
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
      let responseData = error.response.data;
      let message = "";
      for (let k in responseData.errors) {
        message = responseData.errors[k];
      }
      if (message==="") {
        message = responseData.message;
      }
      context.setState({
        redirect: true,
      });
    });
  }

  parseItems(itemsData) {
    // list of items to display
    let items = [];
    let cannotEditText = "To edit this letter you must disable the letter transcription first!";
    let cannotTranscribeText = "To edit the transcription of this letter you must enable the letter transcription first!";
    let cannotEnableText = "You must add page(s) to this letter before you can enable the letter's transcription";
    for (let i=0; i<itemsData.length; i++) {
      let item = itemsData[i];
      let element = JSON.parse(item.element);
      let defaultThumbnail;
      if (element.pages.length>0) {
        defaultThumbnail = <img className="list-thumbnail small img-responsive" src={domain+"/diyhistory/archive/square_thumbnails/"+element.pages[0].archive_filename} alt={element.title} />
      }
      let status = item.status;
      let transcription_status = item.transcription_status;
      let enableTranscriptionBtn = [];

      let gotoTranscriptionBtn= <li><button className="action-button" title="Transcribe letter" onClick={this.showBtnDisabledConfirm.bind(this, cannotTranscribeText)}>
        <i className="fa fa-file-text-o color-grey"></i>
      </button></li>;

      let editBtn = <li><button className="action-button" title="Edit Letter" onClick={this.showBtnDisabledConfirm.bind(this, cannotEditText)}>
        <i className="fa fa-pencil color-grey"></i>
      </button></li>;

      let deleteBtn = [];
      let rowTitle = <div>
        <Link
          to={{ pathname: '/user-letter/'+item.id, prevlocation: "List Transcriptions", prevlocationpath: "/admin/list-items" }}
        >{defaultThumbnail}</Link>
        <h4 className="user-letters-heading">
          <small className="pull-right">{item.created_at}</small>
          <Link to={{ pathname: '/user-letter/'+item.id, prevlocation: "List Transcriptions", prevlocationpath: "/admin/list-items" }}>{element.title}</Link>
        </h4>
      </div>;

      if (status===0 && transcription_status===-1) {
        enableTranscriptionBtn = <li><button className="action-button" title="Transcription disabled">
          <i className="fa fa-minus color-red"></i>
        </button></li>;

        editBtn = <li><Link to={{ pathname: '/user-letter/'+item.id, prevlocation: "List Transcriptions", prevlocationpath: "/admin/list-items" }} className="action-button" title="Edit letter">
          <i className="fa fa-pencil color-blue"></i>
        </Link></li>;
      }
      else if (status===0 && transcription_status===0) {
        enableTranscriptionBtn = <li><button className="action-button" title="Disable transcription" onClick={this.toggleTranscriptionStatus.bind(this, item.id)}>
          <i className="fa fa-check color-green"></i>
        </button></li>;

        gotoTranscriptionBtn = <li><Link to={{ pathname: '/letter-transcribe/'+item.id, prevlocation: "List Transcriptions", prevlocationpath: "/admin/list-items" }} className="action-button" title="Transcribe letter">
          <i className="fa fa-file-text-o"></i>
        </Link></li>;

        rowTitle = <div>{defaultThumbnail}
          <h4 className="user-letters-heading">
            <small className="pull-right">{item.created_at}</small>
            {element.title}
          </h4>
        </div>;
      }
      if (status!==1) {
        deleteBtn = <li><button className="action-button" title="Delete letter" onClick={this.showDeleteLetterConfirm.bind(this,item.id, element.title)}>
            <i className="fa fa-trash color-red"></i>
          </button></li>;
      }
      if (element.pages.length===0) {
        enableTranscriptionBtn = <li><button className="action-button" title="Transcription disabled"
        onClick={this.showBtnDisabledConfirm.bind(this, cannotEnableText)}>
          <i className="fa fa-minus color-grey"></i>
        </button></li>;

        editBtn = <li><Link to={{ pathname: '/user-letter/'+item.id, prevlocation: "List Transcriptions", prevlocationpath: "/admin/list-items" }} className="action-button" title="Edit letter">
          <i className="fa fa-pencil color-blue"></i>
        </Link></li>;

        gotoTranscriptionBtn = <li><button className="action-button" title="Transcribe letter" onClick={this.showBtnDisabledConfirm.bind(this, cannotTranscribeText)}>
          <i className="fa fa-file-text-o color-grey"></i>
        </button></li>
      }

      let viewItem = <li data-id={item.id} key={i} className="img-clearfix">
        <div className="row">
          <div className="col-xs-12 col-sm-8 col-md-9">
            {rowTitle}
          </div>
          <div className="col-sm-4 col-md-3">
            <ul className="action-buttons-list">
              {enableTranscriptionBtn}
              {gotoTranscriptionBtn}
              {editBtn}
              {deleteBtn}
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

  showDeleteLetterConfirm(id, title) {
    this.setState({
      showDeleteLetterConfirm: true,
      deleteLetterId: id,
      letterName: title
    });
  }

  hideDeleteLetterConfirm() {
    this.setState({
      showDeleteLetterConfirm: false
    });
  }

  deleteLetter() {
    let letterId = this.state.deleteLetterId;
    if (letterId>0) {
      let context = this;
      let path = APIPath+"delete-letter";
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
          showDeleteLetterConfirm: false,
          deleteLetterId: 0,
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

  checkSessionStorage() {
    if (sessionStorage.getItem('admin_list_transcriptions')!==null) {
      let storedState = JSON.parse(sessionStorage.getItem('admin_list_transcriptions'));
      this.setState({
        sort_col:storedState.sort_col,
        sort_dir:storedState.sort_dir,
        current_page:storedState.current_page,
        paginate:storedState.paginate,
        transcription_status: storedState.transcription_status
      });
    }
  }

  setSessionStorage() {
    let newState = {
      sort_col: this.state.sort_col,
      sort_dir: this.state.sort_dir,
      current_page: this.state.current_page,
      paginate: this.state.paginate,
      transcription_status: this.state.transcription_status
    }
    sessionStorage.setItem('admin_list_transcriptions', JSON.stringify(newState));

  }

  componentDidMount() {
    loadProgressBar();
    this.checkSessionStorage();
    let context = this;
    setTimeout(function() {
      context.loadItems();
    },500);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.current_page!==this.state.current_page
      || prevState.paginate!==this.state.paginate
      || prevState.transcription_status!==this.state.transcription_status
      || (prevState.sort_col!==this.state.sort_col || prevState.sort_dir!==this.state.sort_dir)
    ) {
      this.setSessionStorage();
      let context = this;
      setTimeout(function() {
        context.loadItems();
      },500);
    }
  }

  render() {
    let contentTitle = 'Admin List Items';
    let breadCrumbsArr = [{label:contentTitle,path:''}];
    let contentHTML = [];
    let sessionActive = sessionStorage.getItem('sessionActive');
    if (sessionActive!=='true') {
      contentHTML = <div className="item-container">
        <p className="text-center">This is a protected page. <br/>To view this page you must first login or register.</p>
      </div>;
    }
    else if (this.state.redirect) {
      contentHTML = <Redirect to="/"  />;
    }
    else {
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

      let tStatusActive1="",tStatusActive2="",tStatusActive3="";
      if (this.state.transcription_status===null) {
        tStatusActive1="active";
      }
      if (this.state.transcription_status===-1) {
        tStatusActive2="active";
      }
      if (this.state.transcription_status===0) {
        tStatusActive3="active";
      }

      let sortActive1="",sortActive2="",sortActive3="",sortActive4="";
      if (this.state.sort_key===1) {
        sortActive1="active";
      }
      if (this.state.sort_key===2) {
        sortActive2="active";
      }
      if (this.state.sort_key===3) {
        sortActive3="active";
      }
      if (this.state.sort_key===4) {
        sortActive4="active";
      }

      let paginationHTML = <div className="browse-filters">
        <DropdownButton
          title="Status"
          id="status-filter"
          >

          <MenuItem key="1" onClick={this.updateTranscriptionStatus.bind(this,null)} className={tStatusActive1}>All</MenuItem>

          <MenuItem key="2" onClick={this.updateTranscriptionStatus.bind(this,-1)} className={tStatusActive2}>Not available for transcription</MenuItem>

          <MenuItem key="3" onClick={this.updateTranscriptionStatus.bind(this,0)} className={tStatusActive3}>Open for transcription</MenuItem>

        </DropdownButton>

        <DropdownButton
          title="Sort"
          id="sort-filter"
          >
          <MenuItem key="1" onClick={this.updateSort.bind(this,{"col":"element->title","direction":"desc"},1)} className={sortActive1}><i className="fa fa-sort-amount-desc"></i> Title DESC</MenuItem>

          <MenuItem key="2" onClick={this.updateSort.bind(this,{"col":"element->title","direction":"asc"},2)} className={sortActive2}><i className="fa fa-sort-amount-asc"></i> Title ASC</MenuItem>

          <MenuItem key="3" onClick={this.updateSort.bind(this,{"col":"created_at", "direction":"desc"},3)} className={sortActive3}><i className="fa fa-sort-amount-desc"></i> Created date DESC</MenuItem>

          <MenuItem key="4" onClick={this.updateSort.bind(this,{"col":"created_at", "direction":"asc"},4)} className={sortActive4}><i className="fa fa-sort-amount-asc"></i> Created date ASC</MenuItem>
        </DropdownButton>

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

      contentHTML = <div>
      <div className="row">
        <div className="col-xs-12">
          {paginationHTML}
          <div className="list-items-container">
            {content}
          </div>
          {paginationHTML}
        </div>
      </div>

      <ConfirmModal
        headerText="Delete letter"
        bodyText={"The letter \""+this.state.letterName+"\" will be deleted. Continue?"}
        buttonCancel={<button type="button" className="pull-left btn btn-primary btn-sm" onClick={this.hideDeleteLetterConfirm}>Cancel</button>}
        buttonSuccess={<button type="button" className="btn btn-danger btn-sm" onClick={this.deleteLetter}><i className="fa fa-trash-o"></i> Delete</button>}
        showModal={this.state.showDeleteLetterConfirm}
      />

      <ConfirmModal
        headerText="Notice"
        bodyText={<div className="text-center">{this.state.btnDisabledText}</div>}
        buttonCancel={<div className="text-center"><button type="button" className="btn btn-primary btn-sm" onClick={this.hideBtnDisabledConfirm}>Dismiss</button></div>}
        buttonSuccess=""
        showModal={this.state.showBtnDisabledConfirm}
      />
      </div>;
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <BreadCrumbs items={breadCrumbsArr}/>
            <h1><span>{contentTitle}</span></h1>
            {contentHTML}
          </div>
        </div>
      </div>
    );
  }
}
