import React from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {APIPath} from '../common/constants.js';

export default class AuthorsBlock extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      items: [],
    }

  }

  loadItems() {
    if (sessionStorage.getItem("authors_list")!==null && sessionStorage.getItem("authors_list").length>0) {
      let data = JSON.parse(sessionStorage.getItem("authors_list"));
      this.setItems(data);
    }
    else {
      let context = this;
      axios.get(APIPath+"authors?status=1&transcription_status=2")
    	  .then(function (response) {
          let data = response.data.data;
          context.setItems(data);
        })
        .catch(function (error) {
    	    console.log(error);
    	});
    }
  }

  setItems(data) {
    let items = [];
    for (let i=0; i<data.length; i++) {
      let dataItem = data[i];
      let authorLabel = dataItem.creator;
      if (dataItem.creator==="") {
        authorLabel = "Unknown";
      }
      let item = <li key={i} onClick={this.props.returnfunction.bind(this)}>
        <span className="hidden">{dataItem.creator}</span>
        <span className="select-source">
          <i className="fa fa-circle-o">
            <span className="hidden">{dataItem.creator}</span>
          </i>
        </span>
        <span className="source-label">{authorLabel} (<span className="count" data-default={dataItem.count}>{dataItem.count}</span>)</span>
        </li>;
      items.push(item);
    }
    this.setState({
      loading: false,
      items: items
    });
  }
  componentDidMount() {
    this.loadItems();
  }

  render() {
    let content;
    if (this.state.loading) {
      content = <div className="loader-container">
          <ReactLoading type='spinningBubbles' color='#738759' height={60} width={60} delay={0} />
          </div>;
    }
    else {
      content = <ul className="authors-list">{this.state.items}</ul>;
    }
    return (
      <div className="topics-container">
        <h5>Authors</h5>
        {content}
      </div>
    );
  }
}
