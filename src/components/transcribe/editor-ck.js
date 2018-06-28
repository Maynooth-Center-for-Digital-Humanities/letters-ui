import React from 'react';
import {editorExportTranscription, editorImportTranscription} from '../../helpers/xml-editor/xml-editor';
import axios from 'axios';
import {loadProgressBar} from 'axios-progress-bar';
import {APIPath} from '../../common/constants.js';

export default class TranscriptionEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: [],
      firstMount: 0,
      error: []
    }
    this.elementName = "editor_" + this.props.id;
    this.onInput = this.onInput.bind(this);
    this.updateTranscription = this.updateTranscription.bind(this);
    this.resetFirstMount = this.resetFirstMount.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.page.transcription!==this.props.page.transcription) {
      this.updateTranscription(newProps.page.transcription);
    }
  }

  componentDidMount() {
    let configuration = {};
    window.CKEDITOR.replace(this.elementName, configuration);
    let newTranscription = "";
    if (this.props.page.transcription!==null) {
      newTranscription = this.props.page.transcription;
    }
    this.updateTranscription(newTranscription);
    loadProgressBar();

    // add change event listener
    let inputTimeout = null;
    window.CKEDITOR.instances[this.elementName].on('change', function () {
      if (this.state.firstMount===1) {
        return false;
      }
      let data = window.CKEDITOR.instances[this.elementName].getData();
      let context = this;
      if (inputTimeout !== null) {
        clearTimeout(inputTimeout);
      }
      inputTimeout = setTimeout(function () {
        context.onInput(data);
      }, 2000);

    }.bind(this));
  }

  onInput(data) {
    this.setState({
      saving: <span><i>Saving</i> <i className="fa fa-spin fa-circle-o-notch"></i></span>
    })
    let letterId = this.props.letterId;
    let archiveFilename = this.props.page.archive_filename;
    let newData = "";
    if (data!=="") {
      newData = editorExportTranscription(data);
    }

    let context = this;
    let path = APIPath+"update-letter-transcription-page/"+letterId;
    let accessToken = sessionStorage.getItem('accessToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
    axios({
      method: 'POST',
      url: path,
      crossDomain: true,
      data: {"archive_filename": archiveFilename, "transcription": newData}
    })
    .then(function (response) {
      if (response.data.status) {
        context.setState({
          saving: []
        });
        context.props.updatePages(response.data.data);
      }
      else {
        let newError = {
          error: true,
          msg: response.data.message
        };
        context.props.error(newError);
        context.setState({
          saving: <span><i>Save error </i> <i className="fa fa-times"></i></span>
        });
        setTimeout(function() {
          context.setState({
            saving: []
          });
        },1000);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  updateTranscription(data) {
    this.setState({
      firstMount: 1
    });
    let contentMarkup = editorImportTranscription(data);
    window.CKEDITOR.instances[this.elementName].setData(contentMarkup, this.resetFirstMount);
  }

  resetFirstMount() {
    this.setState({
      firstMount: 0
    });
  }

  render() {
    return (
      <div>
        <div className="transcription-saving-container">
          <div className="transcription-saving">{this.state.saving}</div>
        </div>
        <textarea name={this.elementName}></textarea>
      </div>
    );
  }
}
