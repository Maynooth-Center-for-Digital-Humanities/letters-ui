import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import BreadCrumbs from '../../components/breadcrumbs';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {APIPath, domain} from '../../common/constants.js';
import Pagination from '../../helpers/pagination.js';
import {loadProgressBar} from 'axios-progress-bar';

export class ItemsSearchView extends Component {
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
      redirect: false,
      transcription_status_filter: null,
      user_filter: null,
      sort_col: 'score',
      sort_dir: 'desc',
      sort_key: 1,
      transcription_status: null,

      term: "",
      submit_search: false,
    };

    this.updatePage = this.updatePage.bind(this);
    this.updatePaginate = this.updatePaginate.bind(this);
    this.updateTranscriptionStatus = this.updateTranscriptionStatus.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.updatePageNumber = this.updatePageNumber.bind(this);
    this.pageNumberSubmit = this.pageNumberSubmit.bind(this);
    this.loadItems = this.loadItems.bind(this);
    this.toggleTranscriptionStatus = this.toggleTranscriptionStatus.bind(this);

    this.setSessionStorage = this.setSessionStorage.bind(this);
    this.checkSessionStorage = this.checkSessionStorage.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      term: event.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      submit_search: true
    });
  }

  toggleCheckbox(e) {
    let value = true;
    if (e.target.value==="true") {
      value = false;
    }
    if (e.target.name==="search-letters") {
      this.setState({
        search_letters: value
      });
    }
    if (e.target.name==="search-content") {
      this.setState({
        search_content: value
      });
    }
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
    let path = APIPath+"admin/search/"+this.state.term;
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
      for (let i=0; i<itemsData.length; i++) {
        let item = itemsData[i];
        let pageNumber = parseInt(item.page_number,10)-1;
        let element = JSON.parse(item.entry.element);
        let defaultThumbnail;

        if (typeof element.pages[pageNumber]!=="undefined") {
          defaultThumbnail = <img className="list-thumbnail img-responsive" src={domain+"/diyhistory/archive/square_thumbnails/"+element.pages[pageNumber].archive_filename} alt={element.title} />
        }
        let transcription = "";
        if (element.pages[pageNumber].transcription!=="") {
          let transcriptionText = element.pages[pageNumber].transcription.replace(/<[^>]+>/ig," ");
          transcriptionText = transcriptionText.replace("&amp;", "&");
          if (transcriptionText.length>400) {
            transcriptionText = transcriptionText.substring(0,400);
          }

          transcription = transcriptionText+"...";
        }

        let previewLink = '/item/'+item.entry_id;
        let editMetadataLink = '/user-letter/'+item.entry_id;
        let editTrascriptionLink = '/letter-transcribe/'+item.entry_id;
        var browseItem = <li data-id={item.entry_id} key={i} className="img-clearfix">
            {defaultThumbnail}
            <h4>
              {item.title}<br/>
              <span className="search-results-info">page: {item.page_number} | score: {item.score}</span>
            </h4>
            <p>{transcription}</p>
            <Link to={previewLink} className="btn btn-default btn-sm btn-flat" style={{marginRight: "15px"}}>Preview</Link>
            <Link to={editTrascriptionLink} className="btn btn-default btn-sm btn-flat" style={{marginRight: "15px"}}>Edit transcription</Link>
            <Link to={editMetadataLink} className="btn btn-default btn-sm btn-flat">Edit metadata</Link>
          </li>;
        items.push(browseItem);
      }
      if (items.length===0) {
        let empty = <li key={0}><i>There are no letters matching your search criteria</i></li>;
        items.push(empty);
      }
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
        submit_search: false
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

  checkSessionStorage() {
    if (sessionStorage.getItem('admin_search_items')!==null) {
      let storedState = JSON.parse(sessionStorage.getItem('admin_search_items'));
      let submitSearch = false;
      if (storedState.term.length>0) {
        submitSearch = true
      }
      this.setState({
        sort_col:storedState.sort_col,
        sort_dir:storedState.sort_dir,
        current_page:storedState.current_page,
        paginate:storedState.paginate,
        transcription_status: storedState.transcription_status,
        term: storedState.term,
        submit_search: submitSearch
      });
    }
  }

  setSessionStorage() {
    let newState = {
      sort_col: this.state.sort_col,
      sort_dir: this.state.sort_dir,
      current_page: this.state.current_page,
      paginate: this.state.paginate,
      transcription_status: this.state.transcription_status,
      term: this.state.term
    }
    sessionStorage.setItem('admin_search_items', JSON.stringify(newState));

  }

  componentDidMount() {
    loadProgressBar();
    this.checkSessionStorage();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.submit_search ||
      prevState.current_page!==this.state.current_page
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
    let contentTitle = 'Admin Search Items';
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

    let searchFormStyle = {
      margin: "20px 0 0 0"
    }

    let searchform = <div style={searchFormStyle}>
        <form name="general-search-input" onSubmit={this.handleSubmit}>
          <div className="input-group">
            <input onChange={this.handleChange} value={this.state.term} name="search-bar" type="text" className="form-control" placeholder="Admin Search Items" />
            <span className="input-group-btn">
              <button className="btn btn-default" onClick={this.handleSubmit} type="button" id="search-letters-submit">Search</button>
            </span>
          </div>
          <div className="search-checkboxes">
          </div>
        </form>
      </div>;

    let blurClass="";
    if (this.state.loading) {
      blurClass = " blur";
    }
    let content = <ul className={"browse-items"+blurClass}>{this.state.items}</ul>;


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

        <MenuItem key="3" onClick={this.updateSort.bind(this,{"col":"element->date_created", "direction":"desc"},3)} className={sortActive3}><i className="fa fa-sort-amount-desc"></i> Created date DESC</MenuItem>

        <MenuItem key="4" onClick={this.updateSort.bind(this,{"col":"element->date_created", "direction":"asc"},4)} className={sortActive4}><i className="fa fa-sort-amount-asc"></i> Created date ASC</MenuItem>
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
    {searchform}
    <div className="row">
      <div className="col-xs-12">
        {paginationHTML}
        <div className="list-items-container">
          {content}
        </div>
        {paginationHTML}
      </div>
    </div>
  </div>;


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
