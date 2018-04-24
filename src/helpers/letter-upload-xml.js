import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import {APIPath} from '../common/constants.js';
import axios from 'axios';
import {Link,Redirect} from 'react-router-dom';

export default class LetterUploadXML extends Component {
  constructor() {
    super()
    this.state = {
      files: [],
      dissaproved_files: [],
      post_status:false,
      upload_loader:false,
      progress_bar_text:"",
      progress_bar_width:0,
      view_updated_page_btn: [],
      redirect:[]
    }
    this.onDrop = this.onDrop.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.viewUpdated = this.viewUpdated.bind(this);
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

  viewUpdated(path) {
    this.setState({redirect:<Redirect to={path}/>});
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
        let responseData = response.data;
        if (responseData.status===200) {
          context.setState({
            files: [],
            dissaproved_files: [],
            post_status:false,
            progress_bar_text: responseData.message
          });
          let documentId = responseData.data.document_id;
          let refreshPageBtn = <Link to={"/letter/"+documentId} className="btn btn-default">View updated letter page <i className="fa fa-chevron-right"></i></Link>
          setTimeout(function() {
            context.setState({
              upload_loader: false,
              progress_bar_text: "",
              progress_bar_width:0,
              view_updated_page_btn:refreshPageBtn
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
    let filesList = "";
    let dissaprovedFilesList = "";
    let uploadBtn = <button className="btn btn-success" onClick={this.uploadFiles} disabled><i className="fa fa-upload"></i> Upload</button>;
    if (this.state.files.length>0) {
      filesList = <div>
        <b>Selected file</b>
        <ul>
          {
            this.state.files.map(f => <span key={f.name}>{f.name} - {f.size} bytes</span>)
          }
        </ul>
      </div>;
      uploadBtn = <button className="btn btn-success" onClick={this.uploadFiles}><i className="fa fa-upload"></i> Upload</button>;
    }
    if (this.state.dissaproved_files.length>0) {
      dissaprovedFilesList = <div>
        The file <b className="dissaproved">{this.state.dissaproved_files.map(f => <span key={f.name} className="dissaproved-file">{f.name}</span>)}</b> is not allowed!
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
    let dropZoneStyle = {
      width: "100%",
      height: "auto"
    }
    return (
      <div>
        {this.state.redirect}
        <b>Upload new XML file</b>
        <div>
          <div className="dropzone">
            <Dropzone
              multiple={false}
              onDrop={this.onDrop.bind(this)}
              style={dropZoneStyle}
              >
              <p>To upload a new XML file drag and drop the file into the box<br/> - or - <br/>click in the box to browse your computer for the file.</p>
              {filesList}
              {dissaprovedFilesList}
            </Dropzone>
          </div>
          {progressBar}

          <br/>
          {uploadBtn} {this.state.view_updated_page_btn}
        </div>
      </div>
    );
  }
}
