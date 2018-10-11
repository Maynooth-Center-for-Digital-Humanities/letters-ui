import React from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {APIPath} from '../common/constants.js';
import DatePicker from './datepicker';
import moment from 'moment';

export default class DatecreatedBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      startValue: null,
      endValue: null,
      startOpen: false,
      endOpen: false,
      calendarDates: [],
      excludedDates: []
    }
    this.loadItems = this.loadItems.bind(this);
    this.setItems = this.setItems.bind(this);
    this.onChange = this.onChange.bind(this);
    this.startDateClear = this.startDateClear.bind(this);
    this.endDateClear = this.endDateClear.bind(this);
  }

  loadItems() {
    if (sessionStorage.getItem("date_created_list")!==null && sessionStorage.getItem("date_created_list").length>0) {
      let data = JSON.parse(sessionStorage.getItem("date_created_list"));
      this.setItems(data);
    }
    else {
      let context = this;
      axios.get(APIPath+"date_created?status=1&transcription_status=2")
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
    let calendarDates = [];
    for (let i=0; i<data.length; i++) {
      let dataItem = data[i];
      let dateCreated = dataItem.date_created;
      let dateArr = dateCreated.split("-");
      if (dateArr.length>=2) {
        dateCreated = dateCreated.replace("T00:00:00","");
        if (dateCreated.length===10) {
          let newDate = moment(dateCreated);
          if (!calendarDates.includes(newDate)) {
            calendarDates.push(newDate);
          }
        }

      }
    }
    this.setState({
      loading: false,
      calendarDates: calendarDates
    });
  }

  updateItems(data) {
    let dataToArr = Object.keys(data).map(function(key) {
      return key;
    });
    let calendarDates = [];
    for (let i=0;i<dataToArr.length; i++) {
      let dateCreated = dataToArr[i];
      let dateArr = dateCreated.split("-");
      if (dateArr.length>=2) {
        dateCreated = dateCreated.replace("T00:00:00","");
        if (dateCreated.length===10) {
          let newDate = moment(dateCreated);
          if (!calendarDates.includes(newDate)) {
            calendarDates.push(newDate);
          }
        }
      }
    }
    this.setState({
      loading: false,
      calendarDates: calendarDates
    });
  }

  onChange (field, value){
    if (field==="endValue" && this.state.startValue!==null) {
      let startValue = moment(this.state.startValue);
      let endValue = moment(value);
      if (endValue<startValue) {
        value = this.state.startValue;
      }
    }
    this.setState({
      [field]: value,
    });
  }

  startDateClear() {
    this.setState({
      startValue: null
    });
  }

  endDateClear() {
    this.setState({
      endValue: null
    });
  }

  componentDidMount() {
    this.loadItems();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.startValue!==this.state.startValue || prevState.endValue!==this.state.endValue) {
      let newStartValue = null;
      let newEndValue = null;
      if (this.state.startValue!==null) {
        newStartValue = moment(this.state.startValue).format("YYYY-MM-DD");
      }
      if (this.state.endValue!==null) {
        newEndValue = moment(this.state.endValue).format("YYYY-MM-DD");
      }
      let returnValues = {
        startValue: newStartValue,
        endValue: newEndValue
      }
      this.props.returnfunction(returnValues);
    }
    if (prevProps.availableDates!== this.props.availableDates) {
      this.updateItems(this.props.availableDates);
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

      content = <div className="row">
        <div className="col-xs-12">
          <DatePicker
            placeholder="From"
            value={this.state.startValue}
            onChange={this.onChange.bind(this, 'startValue')}
            clearFunction={this.startDateClear}
            dates={this.state.calendarDates}
          />
        </div>
        <div className="col-xs-12">
          <DatePicker
            placeholder="To"
            value={this.state.endValue}
            onChange={this.onChange.bind(this, 'endValue')}
            clearFunction={this.endDateClear}
            dates={this.state.calendarDates}
          />
        </div>
      </div>;
    }
    return (
      <div className="topics-container">
        <h5>Date sent</h5>
        {content}
      </div>
    );
  }
}
