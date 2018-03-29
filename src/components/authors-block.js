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
      let items = [];
      for (let i=0; i<data.length; i++) {
        let dataItem = data[i];
        let authorLabel = dataItem.creator;
        if (dataItem.creator==="") {
          authorLabel = "Unknown";
        }
        let item = <li key={i}>
          <span className="select-source">
            <i className="fa fa-circle-o" onClick={this.props.returnfunction.bind(this)}>
              <span className="hidden">{dataItem.creator}</span>
            </i>
          </span>
          <span className="source-label">{authorLabel} ({dataItem.count})</span>
          </li>;
        items.push(item);
      }
      this.setState({
        loading: false,
        items: items
      });
    }
    else {
      let context = this;
      axios.get(APIPath+"authors")
    	  .then(function (response) {
          let data = response.data.data;
          let items = [];
          for (let i=0; i<data.length; i++) {
            let dataItem = data[i];
            let authorLabel = dataItem.creator;
            if (dataItem.creator==="") {
              authorLabel = "Unknown";
            }
            let item = <li key={i}>
              <span className="select-source">
                <i className="fa fa-circle-o" onClick={context.props.returnfunction.bind(this)}>
                  <span className="hidden">{dataItem.creator}</span>
                </i>
              </span>
              <span className="source-label">{authorLabel} ({dataItem.count})</span>
              </li>;
            items.push(item);
          }
          context.setState({
            loading: false,
            items: items
          });
        })
        .catch(function (error) {
    	    console.log(error);
    	});
    }
  }

  componentDidMount() {
    this.loadItems();
  }

  render() {
    let content;
    if (this.state.loading) {
      content = <div className="loader-container">
          <ReactLoading type='spinningBubbles' color='#738759' height='60px' width='60px' delay={0} />
          </div>;
    }
    else {
      content = <ul className="sources-list">{this.state.items}</ul>;
    }
    return (
      <div className="topics-container">
        <h5>Authors</h5>
        {content}
      </div>
    );
  }
}
