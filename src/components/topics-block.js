import React from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {APIPath} from '../common/constants.js';
import {ToggleClass} from '../helpers/helpers.js';

export default class TopicsBlock extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      topics: [],
    }

    this.toggleElementChildren = this.toggleElementChildren.bind(this);
  }

  toggleElementChildren(e) {
    if (e.target.nextSibling===null) {
      return false;
    }
    let toggle = e.target.attributes['data-toggle'].value;
    let newValue = "closed";
    if (toggle==="closed") {
      newValue = "open";
    }
    e.target.setAttribute('data-toggle',newValue);
    // update dropdown arrow
    ToggleClass(e.target.nextSibling, toggle, newValue);
    ToggleClass(e.target.nextSibling.nextSibling, toggle, newValue);

  }

  loadTopics() {
    if (sessionStorage.getItem("topics_list")!==null && sessionStorage.getItem("topics_list").length>0) {
      let data = JSON.parse(sessionStorage.getItem("topics_list"));
      let topics = [];
      for (let i=0; i<data.length; i++) {
        let item = data[i];
        let topic = this.topicItem(item, i);
        topics.push(topic);
      }
      this.setState({
        loading: false,
        topics: topics
      });
    }
    else {
      let context = this;
      axios.get(APIPath+"topics")
    	  .then(function (response) {
          let data = response.data.data;
          console.log(typeof data);
          let topics = [];
          for (let i=0; i<data.length; i++) {
            let item = data[i];
            let topic = context.topicItem(item, i);
            topics.push(topic);
          }
          context.setState({
            loading: false,
            topics: topics
          });
        })
        .catch(function (error) {
    	    console.log(error);
    	});
    }
  }

  topicItem(item, i) {
    let children = item.children;
    let childrenHTML = [];
    let toggleChildren = [];
    let hasChildrenClass = "";
    if (children.length>0) {
      childrenHTML = this.topicChildren(children, i);
      toggleChildren = <span className="toggle-children">
        <i className="fa fa-angle-left"></i>
      </span>;
      hasChildrenClass = " has-children";
    }
    let topic = <li key={i} data-key={i}>
      <span className="select-topic">
        <i className="fa fa-circle-o" data-id={item.id} onClick={this.props.returnfunction.bind(this)}></i>
      </span>
      <span
        className={"topic-label"+hasChildrenClass}
        data-toggle="closed"
        onClick={this.toggleElementChildren}
          >{item.name} ({item.count})</span>
      {toggleChildren}
      {childrenHTML}
    </li>;
    return topic;
  }

  topicChildren(children, i) {
    let childrenItems = [];
    let childrenObject = [];
    if (children.length>0) {
      for (let j=0; j<children.length; j++) {
        let child = children[j];
        let childItem = this.topicItem(child, i+"."+j);
        childrenItems.push(childItem);
      }
      childrenObject = <ul className="topics-list-children" data-parent={i}>{childrenItems}</ul>;
    }

    return childrenObject;
  }

  componentDidMount() {
    this.loadTopics();
  }

  render() {
    let content;
    if (this.state.loading) {
      content = <div className="loader-container">
          <ReactLoading type='spinningBubbles' color='#738759' height='60px' width='60px' delay={0} />
          </div>;
    }
    else {
      content = <ul className="topics-list">{this.state.topics}</ul>;
    }
    return (
      <div className="topics-container">
        <h5>Keywords</h5>
        {content}
      </div>
    );
  }
}
