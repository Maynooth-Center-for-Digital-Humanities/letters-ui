import React, {Component} from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {Link} from 'react-router-dom';
import BreadCrumbs from '../components/breadcrumbs';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {APIPath} from '../common/constants.js';
import TopicsBlock from '../components/topics-block.js';

export class BrowseView extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      browseItems: [],
      paginationItems: [],
      current_page: 1,
      next_page: 1,
      prev_page: 1,
      from: 0,
      last_page: 0,
      path: APIPath+"index",
      per_page: 0,
      to: 0,
      total: 0,
      sort: "desc",
      paginate: 10,
      gotopage_value: 1,
      temp_page:1
    };

    this.gotoPage = this.gotoPage.bind(this);
    this.showPage = this.showPage.bind(this);
    this.updatePaginate = this.updatePaginate.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.updatePageNumber = this.updatePageNumber.bind(this);
    this.pageNumberSubmit = this.pageNumberSubmit.bind(this);
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
        gotopage_value:newPage,
        current_page: newPage,
        loading: true
      });
    }
  }

  showPage() {
    var browseContext = this;
    let path = this.state.path;
    axios.get(path, {
        params: {
          page: this.state.current_page,
          sort: this.state.sort,
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
          let element = JSON.parse(item.element);

          var keywords = [];
          for (var j=0;j<element.topics.length; j++) {
            var topic = element.topics[j];
            var comma = '';
            if (j>0) comma = ', ';
            var keyword = <span data-id={topic.topic_ID} key={j}>{comma}{topic.topic_name}</span>;
            keywords.push(keyword);
          }

          var browseItem = <li data-id={item.id} key={i}>
              <h4><Link to={ 'item/'+item.id}>{element.title}</Link></h4>
              <span className='browse-item-keywords'>Keywords: {keywords}</span>
              <p>{element.description}</p>
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
          gotopage_value: currentPage
        });
  	  })
  	  .catch(function (error) {
  	    console.log(error);
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
        prevState.sort!==this.state.sort
      )
    ) {
      this.showPage();
    }
  }

  render() {
    let breadCrumbsArr = [{label:'Browse',path:''}];
    let content;
    if (this.state.loading) {
      content = <div className="loader-container">
          <ReactLoading type='spinningBubbles' color='#738759' height='60px' width='60px' delay={0} />
          </div>;
    }
    else {
      content = <ul className="browse-items">{this.state.browseItems}</ul>;
    }

    let activeDesc="",activeAsc="";
    if (this.state.sort==="desc") {
      activeDesc = "active";
    }
    if (this.state.sort==="asc") {
      activeAsc = "active";
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
        title="Sort"
        id="sort-filter"
        >
        <MenuItem key="1" onClick={this.updateSort.bind(this,"desc")} className={activeDesc}><i className="fa fa-sort-amount-desc"></i> Desc</MenuItem>
        <MenuItem key="2" onClick={this.updateSort.bind(this,"asc")} className={activeAsc}><i className="fa fa-sort-amount-asc"></i> Asc</MenuItem>
      </DropdownButton>

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

    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
            <h2>Browse</h2>
            {paginationHTML}
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-3">
            <TopicsBlock />
          </div>
          <div className="col-xs-12 col-sm-9">
          {content}
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            {paginationHTML}
          </div>
        </div>

      </div>
    );
  }
}
