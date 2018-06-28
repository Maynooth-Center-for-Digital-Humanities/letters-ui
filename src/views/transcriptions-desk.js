import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
//import ReactLoading from 'react-loading';
import {Link} from 'react-router-dom';
import BreadCrumbs from '../components/breadcrumbs';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {APIPath, domain} from '../common/constants.js';
import TopicsBlock from '../components/topics-block.js';
import SourcesBlock from '../components/sources-block.js';
import AuthorsBlock from '../components/authors-block.js';
import GendersBlock from '../components/genders-block.js';
import LanguagesBlock from '../components/languages-block.js';
import DatecreatedBlock from '../components/date_created-block.js';
import Pagination from '../helpers/pagination.js';
import {PreloaderCards,ToggleClass,ReplaceClass,Emptyitemscard,CompareFilterTopics,CompareFilterGeneral} from '../helpers/helpers.js';
import {loadProgressBar} from 'axios-progress-bar';

export class TranscriptionsDeskView extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      browseItems: [],
      page: 1,
      current_page: 1,
      temp_page: 1,
      path: APIPath+"index",
      topics_path: APIPath+"topicsbyid/",
      total: 0,
      sort: "desc",
      paginate: 10,
      paginationHTML: [],
      length: 0,
      firstLoad:1,
      selectedTopics: [],
      keywords_ids: [],
      sources: [],
      authors: [],
      genders: [],
      languages: [],
      date_sent: [],
      queryStatus: 0,
      queryTranscriptionStatus: 0,
    };

    this.updatePage = this.updatePage.bind(this);
    this.showPage = this.showPage.bind(this);
    this.updatePaginate = this.updatePaginate.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.updatePageNumber = this.updatePageNumber.bind(this);
    this.pageNumberSubmit = this.pageNumberSubmit.bind(this);
    this.topicFilter = this.topicFilter.bind(this);
    this.filterContent = this.filterContent.bind(this);
    this.browserItems = this.browserItems.bind(this);
    //this.selectedTopicsToggleChildren = this.selectedTopicsToggleChildren.bind(this);
    this.sourcesFilter = this.sourcesFilter.bind(this);
    this.authorsFilter = this.authorsFilter.bind(this);
    this.gendersFilter = this.gendersFilter.bind(this);
    this.languagesFilter = this.languagesFilter.bind(this);
    this.datecreatedFilter = this.datecreatedFilter.bind(this);

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

  topicFilter(e) {
    e.preventDefault();
    let parent = e.currentTarget;
    let element = parent.querySelectorAll(".select-topic")[0].querySelectorAll("i")[0];
    let label = parent.querySelectorAll(".topic-label")[0];

    let className = element.className;
    let prevTopics = this.state.selectedTopics;
    let selectedTopics = [];
    for (let i=0;i<prevTopics.length;i++) {
      selectedTopics.push(prevTopics[i]);
    }
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
    this.setState({
      loading:true,
      selectedTopics: selectedTopics,
      keywords_ids:selectedTopics
    });
    ToggleClass(element, "fa-circle-o", "fa-check-circle-o");
    ToggleClass(label, "", "active");
  }

  sourcesFilter(e) {
    e.preventDefault();
    let parent = e.currentTarget;
    let element = parent.querySelectorAll(".select-source")[0].querySelectorAll("i")[0];
    let label = parent.querySelectorAll(".source-label")[0];

    let className = element.className;
    let prevSources = this.state.sources;
    let selectedSources = [];
    for (let i=0;i<prevSources.length;i++) {
      selectedSources.push(prevSources[i]);
    }
    let currentSource = element.children[0].innerText;
    if (className==="fa fa-circle-o") {
      if (selectedSources.indexOf(currentSource)===-1) {
        selectedSources.push(currentSource);
      }
    }
    else {
      if (selectedSources.indexOf(currentSource)>-1) {
        let index = selectedSources.indexOf(currentSource);
         selectedSources.splice(index, 1);
      }
    }
    ToggleClass(element, "fa-circle-o", "fa-check-circle-o");
    ToggleClass(label, "", "active");
    this.setState({
      loading:true,
      sources: selectedSources
    });
  }

  authorsFilter(e) {
    e.preventDefault();
    let parent = e.currentTarget;
    let element = parent.querySelectorAll(".select-source")[0].querySelectorAll("i")[0];
    let label = parent.querySelectorAll(".source-label")[0];

    let className = element.className;
    let prevAuthors = this.state.authors;
    let selectedAuthors = [];
    for (let i=0;i<prevAuthors.length;i++) {
      selectedAuthors.push(prevAuthors[i]);
    }
    let currentAuthor = element.children[0].innerText;
    if (className==="fa fa-circle-o") {
      if (selectedAuthors.indexOf(currentAuthor)===-1) {
        selectedAuthors.push(currentAuthor);
      }
    }
    else {
      if (selectedAuthors.indexOf(currentAuthor)>-1) {
        let index = selectedAuthors.indexOf(currentAuthor);
         selectedAuthors.splice(index, 1);
      }
    }
    ToggleClass(element, "fa-circle-o", "fa-check-circle-o");
    ToggleClass(label, "", "active");
    this.setState({
      loading:true,
      authors: selectedAuthors
    });

  }

  gendersFilter(e) {
    e.preventDefault();
    let parent = e.currentTarget;
    let element = parent.querySelectorAll(".select-source")[0].querySelectorAll("i")[0];
    let label = parent.querySelectorAll(".source-label")[0];

    let className = element.className;
    let prevGenders = this.state.genders;
    let selectedGenders = [];
    for (let i=0;i<prevGenders.length;i++) {
      selectedGenders.push(prevGenders[i]);
    }
    let currentGender = element.children[0].innerText;
    if (className==="fa fa-circle-o") {
      if (selectedGenders.indexOf(currentGender)===-1) {
        selectedGenders.push(currentGender);
      }
    }
    else {
      if (selectedGenders.indexOf(currentGender)>-1) {
        let index = selectedGenders.indexOf(currentGender);
         selectedGenders.splice(index, 1);
      }
    }
    ToggleClass(element, "fa-circle-o", "fa-check-circle-o");
    ToggleClass(label, "", "active");
    this.setState({
      loading:true,
      genders: selectedGenders
    });
  }

  languagesFilter(e) {
    e.preventDefault();
    let parent = e.currentTarget;
    let element = parent.querySelectorAll(".select-source")[0].querySelectorAll("i")[0];
    let label = parent.querySelectorAll(".source-label")[0];

    let className = element.className;
    let prevLanguages = this.state.languages;
    let selectedLanguages = [];
    for (let i=0;i<prevLanguages.length;i++) {
      selectedLanguages.push(prevLanguages[i]);
    }
    let currentLanguage = element.children[0].innerText;
    if (className==="fa fa-circle-o") {
      if (selectedLanguages.indexOf(currentLanguage)===-1) {
        selectedLanguages.push(currentLanguage);
      }
    }
    else {
      if (selectedLanguages.indexOf(currentLanguage)>-1) {
        let index = selectedLanguages.indexOf(currentLanguage);
         selectedLanguages.splice(index, 1);
      }
    }
    ToggleClass(element, "fa-circle-o", "fa-check-circle-o");
    ToggleClass(label, "", "active");
    this.setState({
      loading:true,
      languages: selectedLanguages
    });
  }

  datecreatedFilter(e) {
    e.preventDefault();
    let parent = e.currentTarget;
    let element = parent.querySelectorAll(".select-source")[0].querySelectorAll("i")[0];
    let label = parent.querySelectorAll(".source-label")[0];

    let className = element.className;
    let prevDate_sent = this.state.languages;
    let selectedDate_sent = [];
    for (let i=0;i<prevDate_sent.length;i++) {
      selectedDate_sent.push(prevDate_sent[i]);
    }
    let currentDate_sent = element.children[0].innerText;
    if (className==="fa fa-circle-o") {
      if (selectedDate_sent.indexOf(currentDate_sent)===-1) {
        selectedDate_sent.push(currentDate_sent);
      }
    }
    else {
      if (selectedDate_sent.indexOf(currentDate_sent)>-1) {
        let index = selectedDate_sent.indexOf(currentDate_sent);
         selectedDate_sent.splice(index, 1);
      }
    }
    ToggleClass(element, "fa-circle-o", "fa-check-circle-o");
    ToggleClass(label, "", "active");
    this.setState({
      loading:true,
      date_sent: selectedDate_sent
    });
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

  filterContent() {
    let browseContext = this;
    let path = APIPath+"indexfiltered";
    axios.get(path, {
      params: {
        sort: this.state.sort,
        page: this.state.current_page,
        paginate: this.state.paginate,
        keywords: this.state.keywords_ids,
        sources: this.state.sources,
        authors: this.state.authors,
        genders: this.state.genders,
        languages: this.state.languages,
        date_sent: this.state.date_sent,
        status: this.state.queryStatus,
        transcription_status: this.state.queryTranscriptionStatus
      }
    })
    .then(function (response) {
      let responseData = response.data.data;
      let itemsData = responseData.data;
      let browseItems = [];
      if (typeof itemsData!=="undefined" && itemsData.length>0) {
        browseItems = browseContext.browserItems(itemsData);
      }
      else browseItems = <Emptyitemscard />;
      // update state
      let currentPage = responseData.current_page;
      if (responseData.last_page<responseData.current_page) {
        currentPage = responseData.last_page;
      }
      browseContext.setState({
        loading:false,
        browseItems: browseItems,
        current_page: currentPage,
        last_page: responseData.last_page,
        total: responseData.total,
        firstLoad:0
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  updateFilters() {
    //let browseContext = this;
    let path = APIPath+"indexfilteredfilters";
    axios.get(path, {
      params: {
        sort: this.state.sort,
        page: 1,
        paginate: this.state.paginate,
        keywords: this.state.keywords_ids,
        sources: this.state.sources,
        authors: this.state.authors,
        genders: this.state.genders,
        languages: this.state.languages,
        date_sent: this.state.date_sent,
        status: this.state.queryStatus,
        transcription_status: this.state.queryTranscriptionStatus
      }
    })
    .then(function (response) {
      let responseData = response.data.data;
      console.log(responseData);
      // topics
      let topics = responseData.keywords;
      CompareFilterTopics(topics);

      // sources
      let sources = responseData.sources;
      CompareFilterGeneral("sources-list",sources);

      // sources
      let authors = responseData.authors;
      CompareFilterGeneral("authors-list",authors);

      // genders
      let genders = responseData.genders;
      CompareFilterGeneral("genders-list",genders);

      // languages
      let languages = responseData.languages;
      CompareFilterGeneral("languages-list",languages);

      // dates_sent
      let dates_sent = responseData.dates_sent;
      CompareFilterGeneral("date_sent-list",dates_sent);
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
      let defaultThumbnail;
      if (element.pages.length>0) {
        defaultThumbnail = <img className="list-thumbnail img-responsive" src={domain+"/diyhistory/archive/square_thumbnails/"+element.pages[0].archive_filename} alt={element.title} />
      }

      var keywords = [];
      for (var j=0;j<element.topics.length; j++) {
        var topic = element.topics[j];
        var comma = '';
        if (j>0) comma = ', ';
        var keyword = <span data-id={topic.topic_ID} key={j}>{comma}{topic.topic_name}</span>;
        keywords.push(keyword);
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
      var browseItem = <li data-id={item.id} key={i} className="img-clearfix">
          <Link to={ 'letter-transcribe/'+item.id}>{defaultThumbnail}</Link>
          <h4><Link to={ 'letter-transcribe/'+item.id}>{element.title}</Link></h4>
          <span className='browse-item-keywords'>Keywords: {keywords}</span>
          <p>{transcription}</p>
        </li>;
      browseItems.push(browseItem);
    }
    return browseItems;
  }

  componentDidMount() {
    this.filterContent();
    this.updateFilters();
    loadProgressBar();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.loading!==this.state.loading &&
      (
        prevState.current_page!==this.state.current_page ||
        prevState.paginate!==this.state.paginate ||
        prevState.sort!==this.state.sort ||
        prevState.keywords_ids!==this.state.keywords_ids ||
        prevState.sources!==this.state.sources ||
        prevState.authors!==this.state.authors ||
        prevState.genders!==this.state.genders ||
        prevState.languages!==this.state.languages ||
        prevState.date_sent!==this.state.date_sent
      )
    )
    {
      this.filterContent();
      this.updateFilters();
    }
  }

  render() {
    let contentHTML,pageContent;
    let contentTitle = "Transcriptions Desk";
    let breadCrumbsArr = {label:contentTitle, path: ''};
    let sessionActive = sessionStorage.getItem('sessionActive');
		if (sessionActive!=='true') {
      contentHTML = <p className="text-center">This is a protected page. <br/>To view this page you must first login or register.</p>
      pageContent = <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
            <h1>{contentTitle}</h1>
            <div className="item-container">{contentHTML}</div>
          </div>
        </div>
      </div>
    }
    else {
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
      pageContent = <div className="container">
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
            <TopicsBlock returnfunction={this.topicFilter} />
            <SourcesBlock returnfunction={this.sourcesFilter} />
            <AuthorsBlock returnfunction={this.authorsFilter} />
            <GendersBlock returnfunction={this.gendersFilter} />
            <LanguagesBlock returnfunction={this.languagesFilter} />
            <DatecreatedBlock returnfunction={this.datecreatedFilter} />
          </div>
          <div className="col-xs-12 col-sm-9">

          {paginationHTML}
          <div className="list-items-container">
            {content}
          </div>
          {paginationHTML}
          </div>
        </div>
      </div>;
    }


    return (
      <div>{pageContent}</div>
    );
  }
}
