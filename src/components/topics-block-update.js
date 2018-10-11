import React from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {APIPath} from '../common/constants.js';
import {ToggleClass} from '../helpers/helpers.js';

export default class TopicsBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      topics: [],
      autocomplete_visible: false,
      autocomplete_value: "",
      selectedTopics: []
    }
    this.toggleElementChildren = this.toggleElementChildren.bind(this);
    this.toggleAutocomplete = this.toggleAutocomplete.bind(this);
    this.autocomplete = this.autocomplete.bind(this);
  }

  toggleElementChildren(e) {
    e.preventDefault();
    let targetNode = e.currentTarget;
    if (targetNode.nextSibling===null) {
      return false;
    }
    let toggle = targetNode.attributes['data-toggle'].value;
    let newValue = "closed";
    if (toggle==="closed") {
      newValue = "open";
    }
    targetNode.setAttribute('data-toggle',newValue);
    // update dropdown arrow
    ToggleClass(targetNode.nextSibling, toggle, newValue);
    ToggleClass(targetNode, toggle, newValue);
  }

  loadTopics() {
    console.log("load-topics");
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
      axios.get(APIPath+"topics?status=1&transcription_status=2")
    	  .then(function (response) {
          let data = response.data.data;
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
      toggleChildren = <span className="toggle-children"
      onClick={this.toggleElementChildren}
      data-toggle="closed"
      >
        <i className="fa fa-angle-left"></i>
      </span>;
      hasChildrenClass = " has-children";
    }

    let iconClass = "fa fa-circle-o";
    if (this.props.selected.indexOf(parseInt(item.id,10))>-1) {
      console.log(1);
      iconClass = "fa fa-check-circle-o";
    }
    let topic = <li key={i} data-key={i}>
      <a onClick={this.props.returnfunction.bind(this, item.id)}>
        <span className="hidden">{item.name}</span>
        <span className="select-topic">
          <i className={iconClass} data-id={item.id}></i>
        </span>
      <span
        className={"topic-label"+hasChildrenClass}
        data-toggle="closed"
          >{item.name} (<span className="count" data-default={item.count}>{item.count}</span>)</span>
      </a>
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

  toggleAutocomplete() {
    let newStatus = true;
    if (this.state.autocomplete_visible) {
      newStatus = false;
    }
    this.setState({
      autocomplete_visible: newStatus
    })
  }

  autocomplete(e) {
    this.setState({
      autocomplete_value: e.target.value
    })
  }

  componentDidMount() {
    this.loadTopics();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps.selected, this.props.selected, prevState.selectedTopics, this.state.selectedTopics);
    if (prevProps.selected!==this.props.selected) {
      this.setState({
        selectedTopics: this.props.selected
      })
    }
  }
  render() {
    let content;
    if (this.state.loading) {
      content = <div className="loader-container">
          <ReactLoading type='spinningBubbles' color='#738759' height={60} width={60} delay={0} />
          </div>;
    }
    else {
      let autocompleteClass=" closed";
      if (this.state.autocomplete_visible) {
        autocompleteClass = "";
      }

      content = <div>
        <h5 onClick={this.toggleAutocomplete}>Keywords
          <span style={{paddingLeft: "5px", fontSize: "14px"}} >
            <i className="fa fa-caret-down"></i>
          </span>
        </h5>
        <div className={"form-group filter-autocomplete"+autocompleteClass}>
          <input className="form-control" type="text" placeholder="filter keywords" onChange={this.autocomplete.bind(this)} value={this.state.autocomplete_value}/>
          <i className="fa fa-times-circle-o"></i>
        </div>
        <ul className="topics-list">{this.state.topics}</ul>
      </div>;
    }
    return (
      <div className="topics-container">
        {content}
      </div>
    );
  }
}
