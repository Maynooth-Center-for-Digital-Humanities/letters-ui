import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

export default class Picker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
    }
  }

  render() {
    let defaultDate = moment('1916-01-01');
    let props = this.props;
    let newValue = props.value;
    if (newValue!==null) {
      defaultDate = newValue;
    }
    let content = <div className="input-group input-group-sm">
      <DatePicker
        dateFormat='YYYY-MM-DD'
        selected={newValue}
        onChange={props.onChange}
        highlightDates={props.dates}
        openToDate={defaultDate}
        placeholderText={props.placeholder}
      />
      <span className="input-group-btn" onClick={props.clearFunction}>
        <button type="button" className="btn btn-letters btn-flat btn-sm"><i className="fa fa-times"></i></button>
      </span>
    </div>;
    return (
      <div className="datepicker-wrapper">{content}</div>
    )
  }
}
