import React, {Component} from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {Link} from 'react-router-dom';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {APIPath, domain} from '../common/constants';
import Pagination from '../helpers/pagination';

export default class SearchLetters extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      term: this.props.term,
      loading: false,
      browseItems: [],
      paginationItems: [],
      current_page: 1,
      from: 1,
      last_page: 1,
      path: APIPath+"fullsearch/",
      total: 1,
      paginate: 10,
      gotopage_value: 1,
      temp_page:1,
      submitted_search: false,
      submit_search: false
    };

    this.gotoPage = this.gotoPage.bind(this);
    this.showPage = this.showPage.bind(this);
    this.updatePaginate = this.updatePaginate.bind(this);
    this.updatePageNumber = this.updatePageNumber.bind(this);
    this.pageNumberSubmit = this.pageNumberSubmit.bind(this);
  }

  gotoPage(pageNum) {
    if (parseInt(pageNum,10)>0 && parseInt(pageNum,10)!==this.state.current_page) {
      this.setState({
        current_page:pageNum,
        loading: true
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
        gotopage_value:newPage,
        current_page: newPage,
        loading: true
      });
    }
  }

  showPage() {
    let browseContext = this;
    let term = this.props.term;
    if (term!=="") {
      let path = this.state.path+term;
      axios.get(path, {
          params: {
            page: this.state.current_page,
            paginate: this.state.paginate
          }
        })
    	  .then(function (response) {
          let responseData = response.data.data;
          let itemsData = responseData.data;

          // list of items to display
          let browseItems = [];
          for (let i=0; i<itemsData.length; i++) {
            let item = itemsData[i];
            let element = JSON.parse(item.entry.element);
            let defaultThumbnail;
            if (element.pages.length>0) {
              defaultThumbnail = <img className="list-thumbnail img-responsive" src={domain+"/diyhistory/archive/square_thumbnails/"+element.pages[0].archive_filename} alt={element.title} />
            }
            let transcription = "";
            if (element.pages[0].transcription!=="") {
              let transcriptionText = element.pages[0].transcription.replace(/<[^>]+>/ig," ");
              transcriptionText = transcriptionText.replace("&amp;", "&");
              if (transcriptionText.length>400) {
                transcriptionText = transcriptionText.substring(0,400);
              }

              transcription = transcriptionText+"...";
            }
            var browseItem = <li data-id={item.entry_id} key={i} className="img-clearfix">
                <Link to={ 'item/'+item.entry_id}>{defaultThumbnail}</Link>
                <h4><Link to={ '/item/'+item.entry_id}>{item.title}</Link></h4>
                <p>{transcription}</p>
              </li>;
            browseItems.push(browseItem);
          }
          if (browseItems.length===0) {
            let empty = <li key={0}><i>There are no letters matching your search criteria</i></li>;
            browseItems.push(empty);
          }
          // update state
          browseContext.setState({
            loading:false,
            browseItems: browseItems,
            current_page: responseData.current_page,
            last_page: responseData.last_page,
            total: responseData.total,
            submit_search: false,
            submitted_search: true
          });
    	  })
    	  .catch(function (error) {
    	    console.log(error);
    	});
    }
    else {
      this.setState({
        loading: false,
        submit_search: false
      });
    }
  }

  componentDidMount() {
    this.showPage();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.submit_search===true && prevProps.term!==this.props.term) {
      this.setState({
        loading: true
      });
    }

    if (
        (
          prevState.current_page!==this.state.current_page ||
          prevState.paginate!==this.state.paginate
        ) && this.state.loading===true ) {
          this.showPage();
        }

    if (prevState.submit_search!==this.props.submit_search) {
        this.showPage();
    }
  }


  render() {

    let content;
    let resultsFound = "";
    let resultsText = "letters";
    if (this.state.total>0) {
      if (this.state.total===1) {
        resultsText = "letter";
      }
      resultsFound = <div className="results-found"><i>Found {this.state.total} {resultsText}</i></div>;
    }
    if (this.state.loading) {
      content = <div className="loader-container">
          <ReactLoading type='spinningBubbles' color='#738759' height={60} width={60} delay={0} />
          </div>;
    }
    else {
      content = <ul className="search-items">{this.state.browseItems}</ul>;
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
          pagination_function={this.gotoPage} />

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

    let searchContent = <div>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
    </div>;
    if ((this.props.term!=="" && this.state.browseItems.length>0) || this.state.submitted_search) {
      searchContent = <div className="search-letters-container">
        <h3>Letters{resultsFound}</h3>
        {paginationHTML}
        {content}
        {paginationHTML}
      </div>;
    }
    return (
        <div>
          {searchContent}
        </div>
    );
  }
}
