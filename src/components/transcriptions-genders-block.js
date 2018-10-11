import React from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {APIPath} from '../common/constants.js';

export default class GendersBlock extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      items: [],
    }

  }

  loadItems() {
    if (sessionStorage.getItem("transcriptions_genders_list")!==null && sessionStorage.getItem("transcriptions_genders_list").length>0) {
      let data = JSON.parse(sessionStorage.getItem("transcriptions_genders_list"));
      this.setItems(data);
    }
    else {
      let context = this;
      axios.get(APIPath+"genders")
    	  .then(function (response) {
          let data = response.data.data;
          sessionStorage.setItem('transcriptions_genders_list', JSON.stringify(data));
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
      let genderLabel = dataItem.gender;
      if (dataItem.gender==="") {
        genderLabel = "Unknown";
      }
      let item = <li key={i} onClick={this.props.returnfunction.bind(this)}>
        <span className="hidden">{dataItem.gender}</span>
        <span className="select-source">
          <i className="fa fa-circle-o">
            <span className="hidden">{dataItem.gender}</span>
          </i>
        </span>
        <span className="source-label">{genderLabel} (<span className="count" data-default={dataItem.count}>{dataItem.count}</span>)</span>
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
      content = <div>
        <h5>Gender</h5>
        <ul className="genders-list">{this.state.items}</ul>
      </div>;
    }
    return (
      <div className="topics-container">
        {content}
      </div>
    );
  }
}
