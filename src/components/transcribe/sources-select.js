import React from 'react';
import { Creatable } from 'react-select';
import axios from 'axios';
import {APIPath} from '../../common/constants';

export default class SourcesSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectOptions: []
    }
    this.loadItems = this.loadItems.bind(this);
  }

  loadItems() {
    if (sessionStorage.getItem("upload_sources_list")!==null && sessionStorage.getItem("upload_sources_list").length>0) {
      let data = JSON.parse(sessionStorage.getItem("upload_sources_list"));
      this.setItems(data);
    }
    else {
      let context = this;
      axios.get(APIPath+"sources")
    	  .then(function (response) {
          let data = response.data.data;
          context.setItems(data);
          sessionStorage.setItem("upload_sources_list", JSON.stringify(data));
        })
        .catch(function (error) {
    	    console.log(error);
    	});
    }
  }

  setItems(data) {
    let items = [];
    for (let i=0; i<data.length; i++) {
      let item = data[i];
      let row = { label: item.source, value: item.source };
      items.push(row);
    }
    this.setState({
      selectOptions: items
    });
  }

  componentDidMount() {
    this.loadItems();

  }

  render() {
    const selectOptions = this.state.selectOptions;
    return (
      <Creatable
        name={this.props.elementName}
        value={this.props.selected}
        onChange={this.props.onChangeFunction}
        options={selectOptions}
        multi={this.props.multi}
        removeSelected={this.props.removeSelected}
      />
    );
  }
}
