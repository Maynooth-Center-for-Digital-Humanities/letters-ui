import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
//import ReactLoading from 'react-loading';
import {Link} from 'react-router-dom';
import BreadCrumbs from '../components/breadcrumbs';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {APIPath} from '../common/constants.js';
import TopicsBlock from '../components/topics-block.js';
import Pagination from '../helpers/pagination.js';
import {PreloaderCards,ToggleClass,ReplaceClass,Emptyitemscart} from '../helpers/helpers.js';

export class BrowseView extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      browseItems: [],
      page: 1,
      current_page: 1,
      path: APIPath+"index",
      topics_path: APIPath+"topicsbyid/",
      total: 0,
      sort: "desc",
      paginate: 10,
      paginationHTML: [],
      length: 0,
      firstLoad:1,
      selectedTopics: []
    };

    this.updatePage = this.updatePage.bind(this);
    this.showPage = this.showPage.bind(this);
    this.updatePaginate = this.updatePaginate.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.updatePageNumber = this.updatePageNumber.bind(this);
    this.pageNumberSubmit = this.pageNumberSubmit.bind(this);
    this.topicFilter = this.topicFilter.bind(this);
    this.topicLoad = this.topicLoad.bind(this);
    this.browserItems = this.browserItems.bind(this);
    this.selectedTopicsToggleChildren = this.selectedTopicsToggleChildren.bind(this);
  }

  updatePage(e) {
    if (e>0 && e!==this.state.current_page) {
      this.setState({
        loading:true,
        current_page: e
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

  topicFilter(e) {
    let element = e.target;
    let parent = ReactDOM.findDOMNode(element).parentNode.parentNode;
    let className = element.className;
    this.selectedTopicsToggleChildren(parent,className);
    let selectedTopics = this.state.selectedTopics;
    let currentId = element.getAttribute("data-id");
    if (className==="fa fa-circle-o") {
      if (selectedTopics.indexOf(currentId)===-1) {
        selectedTopics.push(currentId);
      }
    }
    else {
      if (selectedTopics.indexOf(currentId)>-1) {
        let index = selectedTopics.indexOf(currentId);
         selectedTopics.splice(index, 1);
      }
    }
    this.setState({selectedTopics: selectedTopics});
    ToggleClass(element, "fa-circle-o", "fa-check-circle-o");
    this.topicLoad(selectedTopics);
  }

  selectedTopicsToggleChildren(parent, className) {
    let selectedTopics = this.state.selectedTopics;
    let children = ReactDOM.findDOMNode(parent).children;

    if (typeof children[3]==="object") {
      let childrenTopics = children[3];
      let childrenLi = ReactDOM.findDOMNode(childrenTopics).children;

      for (let i=0;i<childrenLi.length;i++) {
        let liChildren = ReactDOM.findDOMNode(childrenLi[i]).children;
        let selectTopicI = ReactDOM.findDOMNode(liChildren[0]).children;

        let currentId = selectTopicI[0].getAttribute("data-id");
        if (className==="fa fa-circle-o") {
          if (selectedTopics.indexOf(currentId)===-1) {
            selectedTopics.push(currentId);
          }
        }
        else {
          if (selectedTopics.indexOf(currentId)>-1) {
            let index = selectedTopics.indexOf(currentId);
             selectedTopics.splice(index, 1);
          }
        }
        if (typeof liChildren[3]==="object") {
          let secondChild = ReactDOM.findDOMNode(liChildren[3]).parentNode;
          this.selectedTopicsToggleChildren(secondChild, className);
        }
        let className1 = "fa-check-circle-o";
        let className2 = "fa-circle-o";
        if (className==="fa fa-circle-o") {
          className1 = "fa-circle-o";
          className2 = "fa-check-circle-o";
        }
        ReplaceClass(selectTopicI[0], className1, className2);
      }
    }
    this.setState({selectedTopics: selectedTopics});
  }

  topicLoad(ids) {
    if (ids.length===0) {
      this.showPage();
      return false;
    }
    let browseContext = this;
    let path = APIPath+"topicsbyid/"+ids;
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
        let browseItems = [];
        if (typeof itemsData!=="undefined") {
          browseItems = browseContext.browserItems(itemsData);
        }
        else browseItems = <Emptyitemscart />;
        // update state
        browseContext.setState({
          loading:false,
          browseItems: browseItems,
          current_page: responseData.current_page,
          last_page: responseData.last_page,
          total: responseData.total,
          firstLoad:0
        });
      })
      .catch(function (error) {
        console.log(error);
    });
  }

  showPage() {
    let browseContext = this;
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
        let browseItems = [];
        if (typeof itemsData!=="undefined") {
          browseItems = browseContext.browserItems(itemsData);
        }
        // update state
        browseContext.setState({
          loading:false,
          browseItems: browseItems,
          current_page: responseData.current_page,
          last_page: responseData.last_page,
          total: responseData.total,
          firstLoad:0
        });
      })
  	  .catch(function (error) {
  	    console.log(error);
  	});
  }

  browserItems(itemsData) {
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
    return browseItems;
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
    if (this.state.loading && this.state.firstLoad===1) {
      let browseItems = PreloaderCards(11);
      content = <ul className="browse-items">{browseItems}</ul>;
    }
    else if (this.state.loading && this.state.firstLoad===0){
      content = <ul className="browse-items blur">{this.state.browseItems}</ul>;
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

    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-3">
            <h3 className="column-title">Filters</h3>
          </div>
          <div className="col-xs-12 col-sm-9">
            <h2>Browse</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-3">
            <TopicsBlock returnfunction={this.topicFilter}/>
          </div>
          <div className="col-xs-12 col-sm-9">

          {paginationHTML}
          <div className="list-items-container">
            {content}
          </div>
          {paginationHTML}
          </div>
        </div>
      </div>
    );
  }
}
