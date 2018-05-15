import React, {Component} from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {Link} from 'react-router-dom';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {WPCustomRestPath} from '../common/constants';
import {stripHTML} from '../helpers/helpers';
import Pagination from '../helpers/pagination';
import BreadCrumbs from '../components/breadcrumbs';

export class WPCategoryView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      browseItems: [],
      current_page: 1,
      path: WPCustomRestPath+"category-list/",
      per_page: 0,
      total: 1,
      paginate: 10,
      gotopage_value: 1,
      temp_page: 1,
      category_name: ""
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
    let slug = this.props.match.params.slug;
    if (slug!=="") {
      let path = this.state.path;
      axios.get(path, {
          params: {
            slug: slug,
            page: this.state.current_page,
            posts_per_page: this.state.paginate,
            orderby: "date"
          }
        })
    	  .then(function (response) {
          let responseData = response.data.data;
          let itemsData = responseData.data;

          // list of items to display
          let browseItems = [];
          for (let i=0; i<itemsData.length; i++) {
            let item = itemsData[i];
            let defaultThumbnail;
            if (item.thumbnail!=="") {
              defaultThumbnail = <img className="list-thumbnail img-responsive" src={item.thumbnail} alt={item.post_title} />
            }
            let description = "";
            if (item.description!=="") {
              let descriptionText = stripHTML(item.description);
              if (descriptionText.length>400) {
                descriptionText = descriptionText.substring(0,400);
              }

              description = descriptionText+"...";
            }
            var browseItem = <li data-id={item.ID} key={i} className="img-clearfix">
                <Link to={ 'wp-post/'+item.post_name}>{defaultThumbnail}</Link>
                <h4><Link to={ '/wp-post/'+item.post_name}>{item.post_title}</Link></h4>
                <p>{description}</p>
              </li>;
            browseItems.push(browseItem);
          }
          if (browseItems.length===0) {
            let empty = <li key={0}><i>There are no articles matching your search criteria</i></li>;
            browseItems.push(empty);
          }

          let categoryName = "";
          if (typeof responseData.category[0]!=="undefined") {
            categoryName = responseData.category[0].cat_name;
          }
          // update state
          browseContext.setState({
            loading:false,
            browseItems: browseItems,
            current_page: responseData.current_page,
            last_page: responseData.last_page,
            total: responseData.total,
            submit_search: false,
            category_name: categoryName
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
    if (
        (
          prevState.current_page!==this.state.current_page ||
          prevState.paginate!==this.state.paginate
        ) && this.state.loading===true ) {
          this.showPage();
        }
  }


  render() {

    let content;
    let breadCrumbsArr = [];
    if (this.state.loading) {
      content = <div className="loader-container">
          <ReactLoading type='spinningBubbles' color='#738759' height='60px' width='60px' delay={0} />
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

    let contentHTML = "";
    if (this.props.term!=="") {
      breadCrumbsArr.push({label:this.state.category_name,path:''});
      contentHTML = <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
            <h1>{this.state.category_name}</h1>
            <div className="item-container">
              {paginationHTML}
              {content}
              {paginationHTML}
            </div>
          </div>
        </div>
      </div>;
    }
    return (
        <div>
          {contentHTML}
        </div>
    );
  }
}
