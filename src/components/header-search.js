import React from 'react';
import {Redirect} from 'react-router-dom';

class SearchInput extends React.Component {
  constructor(props) {
    super();
    this.state ={
      term: "",
      redirect: 0
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      term: event.target.value,
      redirect: 0
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      redirect: 1
    });
  }

  componentDidMount() {
    this.setState({
      redirect: 0
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.redirect===1) {
      this.setState({
        redirect: 2
      })
    }

  }

  render() {
    let redirectElement;

    if (this.state.redirect===1) {
      redirectElement = <Redirect to={{
        pathname: '/blank',
        state: {from: 'header_search'},
        key: 'header_search'
      }}
      />
    }
    if (this.state.redirect===2) {
      redirectElement = <Redirect to={{
        pathname: '/fullsearch/'+this.state['term'],
        state: {from: 'header_search'},
        key: 'header_search'
      }}
      />
    }
    return (
      <div>
        <form name="search-letters-input" onSubmit={this.handleSubmit}>
          <div className="input-group">
            <input onChange={this.handleChange} value={this.state.term} name="search-bar" type="text" className="form-control" placeholder="Search Letters 1916-1923" />
            <span className="input-group-btn">
              <button className="btn btn-default" onClick={this.handleSubmit} type="button" id="search-letters-submit">Search</button>
            </span>
          </div>
        </form>
        {redirectElement}
      </div>
    )
  }
}

export default SearchInput;