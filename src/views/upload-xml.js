import React, {Component} from 'react';
import BreadCrumbs from '../components/breadcrumbs';
import Dropzone from 'react-dropzone';
import {APIPath} from '../common/constants.js';
import axios from 'axios';

export class UploadXML extends Component {
  constructor() {
    super()
    this.state = {
      files: [],
      dissaproved_files: [],
      post_status:false,
      upload_loader:false,
      progress_bar_text:"",
      progress_bar_width:0
    }
    this.onDrop = this.onDrop.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
  }

  componentDidMount() {
    this.setState({
      files: [],
      dissaproved_files: [],
      post_status:false,
      upload_loader:false,
      progress_bar_text:"",
      progress_bar_width:0
    });
  }

  onDrop(files) {
    let approvedFiles = [];
    let disapprovedFiles = [];
    for (let i=0; i<files.length;i++) {
      let file = files[i];
      if (file.type === "text/xml") {
        approvedFiles.push(file);
      }
      else {
        disapprovedFiles.push(file);
      }
    }
    this.setState({
      files: approvedFiles,
      dissaproved_files: disapprovedFiles
    });

  }

  uploadFiles() {
    if (this.state.files.length===0) {
      return false;
    }
    let postStatus = this.state.post_status;
    if (postStatus===true) {
      return false;
    }
    this.setState({post_status:true});
    let files = this.state.files;
    let context = this;
    let path = APIPath+"fileupload";
    let postData = new FormData();
    files.forEach(function(file) {
      postData.append("data[]",file);
    });
    postData.append("format", "xml_tei_letter19xx");
    let accessToken = sessionStorage.getItem('accessToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
    context.setState({
      upload_loader:true
    });
    axios({
      method: "post",
      url: path,
      data: postData,
      crossDomain: true,
      config: { headers: {'Content-Type': 'multipart/form-data'}},
      onUploadProgress: function (progressEvent){
        let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
        let progressBarText = "Uploading... "+parseFloat(percentCompleted).toFixed(2)+"%";
        let progressBarWidth = percentCompleted+"%";
        context.setState({
          progress_bar_text:progressBarText,
          progress_bar_width: progressBarWidth
        });
      }
    })
    .then(function (response) {
        if (response.statusText==="OK") {
          context.setState({
            files: [],
            dissaproved_files: [],
            post_status:false,
            progress_bar_text: response.data
          });
          setTimeout(function() {
            context.setState({
              upload_loader: false,
              progress_bar_text: "",
              progress_bar_width:0
            });
          },2000);
        }
    })
    .catch(function (response) {
        //handle error
        context.setState({post_status:false});
        console.log(response);
    });
  }

  render() {
    let breadCrumbsArr = [{label:'Upload XML',path:''}];
    let filesList = "";
    let dissaprovedFilesList = "";
    if (this.state.files.length>0) {
      filesList = <div>
        <h3>Files list</h3>
        <ul>
          {
            this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
          }
        </ul>
      </div>
    }
    if (this.state.dissaproved_files.length>0) {
      dissaprovedFilesList = <div>
        <h3>Dissaproved Files list</h3>
        <ul>{this.state.dissaproved_files.map(f => <li key={f.name} className="dissaproved-file">{f.name} - {f.size} bytes</li>)}</ul>
      </div>
    }

    let progressBar = "";
    let stateWidth = this.state.progress_bar_width;
    let stateText = this.state.progress_bar_text;
    let statusBarInnerStyle;
    if (this.state.upload_loader===true) {
      statusBarInnerStyle = {
        width: stateWidth
      }
      progressBar = <div className="upload-status-container" id="upload-xml-status">
          <div className="upload-status-bar-inner" style={statusBarInnerStyle}></div>
          <div className="upload-status-bar-text">{stateText}</div>
        </div>;
    }
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>

              <div className="item-container">
                <h2>Upload new XML files</h2>
                <div>
                  <div className="dropzone">
                    <Dropzone onDrop={this.onDrop.bind(this)}>
                      <p>To upload one or more XML files drag and drop them into the box<br/> - or - <br/>click in the box to browse your computer for the files.</p>

                    </Dropzone>
                  </div>
                  {progressBar}
                  {filesList}
                  {dissaprovedFilesList}
                  <br/>
                  <button className="btn btn-success" onClick={this.uploadFiles}><i className="fa fa-upload"></i> Upload</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
