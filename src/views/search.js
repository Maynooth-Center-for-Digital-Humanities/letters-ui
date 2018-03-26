import React, {Component} from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {Link} from 'react-router-dom';
import BreadCrumbs from '../components/breadcrumbs';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {APIPath} from '../common/constants.js';

export class SearchView extends Component {
  constructor() {
    super();
    this.state = {
      term: "",
      loading: true,
      browseItems: [],
      paginationItems: [],
      current_page: 1,
      next_page: 1,
      prev_page: 1,
      from: 0,
      last_page: 0,
      path: APIPath+"fullsearch/",
      per_page: 0,
      to: 0,
      total: 0,
      paginate: 10,
      gotopage_value: 1,
      temp_page:1,
      submit_search: false
    };

    this.gotoPage = this.gotoPage.bind(this);
    this.showPage = this.showPage.bind(this);
    this.updatePaginate = this.updatePaginate.bind(this);
    this.updatePageNumber = this.updatePageNumber.bind(this);
    this.pageNumberSubmit = this.pageNumberSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  gotoPage(pageNum) {
    if (parseInt(pageNum,10)>0) {
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

  handleChange(event) {
    this.setState({
      term: event.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      loading: true,
      submit_search: true
    });
  }

  showPage() {
    let browseContext = this;
    let term = this.state.term;
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
            var browseItem = <li data-id={item.entry_id} key={i}>
                <h4><Link to={ '/item/'+item.entry_id}>{item.title}</Link></h4>
                <p>{item.description}</p>
              </li>;
            browseItems.push(browseItem);
          }
          // pagination
          let currentPage = responseData.current_page;
          let lastPage = responseData.last_page;
          if (currentPage>lastPage) {
            currentPage = lastPage;
          }
          let prevPage = 0;
          if (currentPage>1) {
            prevPage = currentPage-1;
          }
          let nextPage = 0;
          if (currentPage<lastPage) {
            nextPage = currentPage+1;
          }

          let paginationItems = [];
          let paginationFirstItem = <li key="first"><a onClick={browseContext.gotoPage.bind(browseContext,1)}><i className="fa-step-backward fa"></i></a></li>;
          let paginationPrevItem = <li key="prev"><a onClick={browseContext.gotoPage.bind(browseContext,prevPage)}><i className="fa-backward fa"></i></a></li>;
          paginationItems.push(paginationFirstItem);
          paginationItems.push(paginationPrevItem);
          for (let j=0; j<parseInt(responseData.last_page,10);j++) {
            let pageNum = j+1;
            let pageActive = "";

            if (currentPage===pageNum) {
              pageActive = "active";
            }

            let paginationItem =  <li key={pageNum} className={pageActive}><a onClick={browseContext.gotoPage.bind(browseContext,pageNum)}>{pageNum}</a></li>;
            if (pageActive === "active") {
              paginationItem = <li key={pageNum} className={pageActive}><span>{pageNum}</span></li>;
            }

            if (parseInt(currentPage,10)<5 && j<10) {
              paginationItems.push(paginationItem);
            }
            else if (j>(parseInt(currentPage,10)-7) && j<(parseInt(currentPage,10)+5) ){
              paginationItems.push(paginationItem);
            }
          }
          let paginationNextItem = <li key="next"><a onClick={browseContext.gotoPage.bind(browseContext,nextPage)}><i className="fa-forward fa"></i></a></li>;
          let paginationLastItem = <li key="last"><a onClick={browseContext.gotoPage.bind(browseContext,lastPage)}><i className="fa-step-forward fa"></i></a></li>;
          paginationItems.push(paginationNextItem);
          paginationItems.push(paginationLastItem);

          // update state
          browseContext.setState({
            loading:false,
            browseItems: browseItems,
            paginationItems: paginationItems,
            current_page: currentPage,
            next_page: nextPage,
            prev_page: prevPage,
            from: responseData.from,
            last_page: responseData.last_page,
            per_page: responseData.per_page,
            to: responseData.to,
            total: responseData.total,
            gotopage_value: currentPage,
            submit_search: false,
          });
    	  })
    	  .catch(function (error) {
    	    console.log(error);
    	});
    }
    else {
      this.setState({
        loading: false
      });
    }
  }

  componentWillMount() {
    let getTerm = "";
    if (typeof this.props.match.params.term !=='undefined') {
      getTerm = this.props.match.params.term;
    }
    this.setState({
      term: getTerm
    });
  }
  componentDidMount() {
    this.showPage();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.loading!==this.state.loading &&
      (prevState.current_page!==this.state.current_page ||
        prevState.paginate!==this.state.paginate ||
        prevState.term!==this.state.term ||
        prevState.submit_search!==this.state.submit_search
      )
    ) {
      this.showPage();
    }
  }


  render() {

    let breadCrumbsArr = [{label:'Search',path:''}];let content;
    if (this.state.loading) {
      content = <div className="loader-container">
          <ReactLoading type='spinningBubbles' color='#738759' height='60px' width='60px' delay={0} />
          </div>;
    }
    else {
      content = <ul className="browse-items">{this.state.browseItems}</ul>;
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

      <ul className="pagination pagination-sm inline">
        {this.state.paginationItems}
      </ul>

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

    let searchFormStyle = {
      margin: "20px 0 0 0"
    }

    let searchContent = <div>
      <p><i>Please enter a search term to begin your search</i></p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
    </div>;
    if (this.state.term!=="") {
      searchContent = <div>
        {paginationHTML}
        {content}
        {paginationHTML}
      </div>;
    }
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
            <h2>Search</h2>
            <div style={searchFormStyle}>
              <form name="general-search-input" onSubmit={this.handleSubmit}>
                <div className="input-group">
                  <input onChange={this.handleChange} value={this.state.term} name="search-bar" type="text" className="form-control" placeholder="Search Letters 1916-1923" />
                  <span className="input-group-btn">
                    <button className="btn btn-default" onClick={this.handleSubmit} type="button" id="search-letters-submit">Search</button>
                  </span>
                </div>
              </form>
            </div>
            {searchContent}
          </div>
          </div>
      </div>
    );
  }
}
