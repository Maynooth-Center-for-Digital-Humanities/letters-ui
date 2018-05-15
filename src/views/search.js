import React, {Component} from 'react';
import BreadCrumbs from '../components/breadcrumbs';
import SearchLetters from '../components/search-letters';
import SearchWP from '../components/search-wp';

export class SearchView extends Component {
  constructor() {
    super();
    this.state = {
      term: "",
      submit_search: false,
      search_letters: true,
      search_content: true
    }
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

  componentWillMount() {
    let getTerm = "";
    if (typeof this.props.match.params.term !=='undefined') {
      getTerm = this.props.match.params.term;
    }
    this.setState({
      term: getTerm
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.submit_search===true) {
      this.setState({
        submit_search: false
      });
    }
    if (prevProps.match.url!==this.props.match.url) {
      this.setState({
        term: this.props.match.params.term,
        submit_search: true
      });
    }
  }

  render() {
    let breadCrumbsArr = [{label:'Search',path:''}];
    let searchFormStyle = {
      margin: "20px 0 0 0"
    }
    let searchLetters = [];
    let searchContent = [];
    if (this.state.search_letters) {
      searchLetters = <SearchLetters term={this.state.term} submit_search={this.state.submit_search} />;
    }
    if (this.state.search_content) {
      searchContent = <SearchWP term={this.state.term} submit_search={this.state.submit_search} />;
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
                <div className="search-checkboxes">
                  <div className="checkbox">
                    <label>
                      <input onChange={this.toggleCheckbox.bind(this)} name="search-letters" type="checkbox" checked={this.state.search_letters} value={this.state.search_letters} /> search letters
                    </label>
                  </div>
                  <div className="checkbox">
                    <label>
                      <input onChange={this.toggleCheckbox.bind(this)} name="search-content" type="checkbox" checked={this.state.search_content} value={this.state.search_content} /> search content
                    </label>
                  </div>
                </div>
              </form>
            </div>
            {searchLetters}
            {searchContent}
          </div>
        </div>
      </div>
    );
  }
}
