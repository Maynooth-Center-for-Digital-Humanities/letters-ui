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
      error: [],
      docked: true,
      positionX: 0,
      positionY: 0,
      handle: false,
      isResizing: false,
      undockedWidth: 500,
      resize: false,
      width: '600px',
      height: 'auto',
      dragover: false,
      textarea_disabled: false
    }
    this.elementName = "editor_" + this.props.id;
    this.onInput = this.onInput.bind(this);
    this.updateTranscription = this.updateTranscription.bind(this);
    this.resetFirstMount = this.resetFirstMount.bind(this);
    this.resizing = this.resizing.bind(this);
    this.unsetResize = this.unsetResize.bind(this);
    this.updateEditorView = this.updateEditorView.bind(this);

    // ref the editor
    this.editorRef = React.createRef();
  }

  componentWillReceiveProps(newProps) {
    if (
        newProps.page.transcription!==this.props.page.transcription
        || newProps.page.transcription_status!==this.props.page.transcription_status
      ) {
      this.updateEditorView(newProps);
    }
  }

  updateEditorView(newProps) {
    if (typeof newProps.page.transcription_status !=="undefined") {
      if (parseInt(newProps.page.transcription_status,10)>0) {
        this.setState({
          textarea_disabled: true
        });
      }
      else {
        this.setState({
          textarea_disabled: false
        });
        this.updateTranscription(newProps.page.transcription);
      }
    }
    else {
      this.setState({
        textarea_disabled: false
      });
      this.updateTranscription(newProps.page.transcription);
    }
  }

  componentDidMount() {
    // resize handlers
    //window.addEventListener('mousemove', this.resizeMouseMove.bind(this), false);
    //window.addEventListener('mouseup', this.unsetResize.bind(this), false);

    loadProgressBar();
    let context = this;
    let newTranscription = "";
    if (typeof context.props.page.transcription_status !=="undefined") {
      if (parseInt(context.props.page.transcription_status,10)>0) {
        this.setState({
          textarea_disabled: true
        });
      }
    }
    else {
      this.setState({
        textarea_disabled: false
      });
    }
    window.CKEDITOR.replace(this.elementName, {
      on: {
        instanceReady: function(e) {
          if (context.props.page.transcription!==null) {
            newTranscription = context.props.page.transcription;
          }
            context.updateTranscription(newTranscription);


            // add change event listener
            let inputTimeout = null;
            window.CKEDITOR.instances[context.elementName].on('change', function () {
              if (context.state.firstMount===1) {
                return false;
              }
              let data = window.CKEDITOR.instances[this.elementName].getData();
              if (inputTimeout !== null) {
                clearTimeout(inputTimeout);
              }
              inputTimeout = setTimeout(function () {
                context.onInput(data);
              }, 2000);

            }.bind(context));
        }
      }
    });

  }


  componentWillUnmount() {
    //window.removeEventListener('mousemove', this.resizeMouseMove.bind(this), false);
    //window.removeEventListener('mouseup', this.unsetResize.bind(this), false);
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
    let context = this;
    let contentMarkup = editorImportTranscription(data);
    for (this.elementName in window.CKEDITOR.instances) {
      setTimeout(function() {
        window.CKEDITOR.instances[context.elementName].setData(contentMarkup, context.resetFirstMount);
      },500);

    }

  }

  resetFirstMount() {
    this.setState({
      firstMount: 0
    });
  }

  // drag
  setHandle(e) {
    this.setState({
      handle: true
    });
  }

  unsetHandle(e) {
    e.preventDefault();
    let context = this;
    setTimeout(function() {
      context.setState({
        handle: false
      });
    },50);
  }

  startDrag(e) {
    e.stopPropagation();
    // make sure the element is only draggable by its handle
    if (!this.state.handle) {
      e.preventDefault();
    }
  }

  endDrag(e) {
    let newX = e.clientX - this.state.undockedWidth;
    this.setState({
      handle: false,
      docked: false,
      positionX: newX,
      positionY: e.clientY,
    });
    return false;
  }

  // dock
  dragStop(e) {
    let context = this;
    setTimeout(function() {
      context.setState({
        docked: true,
        positionX: 0,
        positionY: 0,
        handle: false,
        dragover: false
      });
    },50);
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  dragOver(e) {
    this.setState({
      dragover: true
    });
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  dragEnter(e) {
    e.preventDefault();
  }

  dragLeave(e) {
    this.setState({
      dragover: false
    });
    e.preventDefault();
    return false;
  }

  // resize
  setResize(e) {
    e.preventDefault();
    this.setState({
      resize: true
    });
  }

  unsetResize(e) {
    e.preventDefault();
    this.setState({
      resize: false
    });
  }

  resizeMouseMove(e) {
    if( this.state.resize ){
      this.resizing(e.clientX, e.clientY);
    }
  }

  resizing(clientX, clientY){
    let node = this.editorRef.current;
    let width = clientX - node.offsetLeft + (16 / 2);
    let height = clientY - node.offsetTop  + (16 / 2);
    this.setState({
      width: width,
      height: height,
    });
  }

  render() {
    let resizeHandleClass="hidden";
    let undockedStyle = {};
    let dropzoneClass = "";
    if (!this.state.docked) {
      undockedStyle = {
        'position': 'fixed',
        'top': this.state.positionY,
        'left': this.state.positionX,
        'zIndex':'999',
        'width': this.state.width,
        'height': this.state.height
      };
      resizeHandleClass = "";
      dropzoneClass = " active";
    }
    let dragOverClass="";
    if (this.state.dragover) {
      dragOverClass = " over";
    }
    let resizeHandle = <div
      className={"transcription-editor-resize-handle "+resizeHandleClass}
        onMouseDown={this.setResize.bind(this)}
      >
      </div>;
    resizeHandle = [];
    let dragHandle = <div
      className="transcription-editor-move-handle"
      onMouseDown={this.setHandle.bind(this)}
      onMouseUp={this.unsetHandle.bind(this)}
      >
      <i className="fa fa-arrows"></i>
    </div>;

    // output
    let editorVisibleClass="";
    let content;
    if (this.state.textarea_disabled) {
      editorVisibleClass = "hidden";
      let transcriptionText = "";
      if (this.props.page.transcription!==null) {
        transcriptionText = this.props.page.transcription;
      }
      content = <div className="transcription-container" dangerouslySetInnerHTML={{__html: transcriptionText}}></div>;
    }

    return (
      <div>
        {content}
        <div className={editorVisibleClass}>
          <div
            className={"transcription-editor-dropzone"+dropzoneClass+dragOverClass}
            onDrop={this.dragStop.bind(this)}
            onDragEnter={this.dragEnter.bind(this)}
            onDragOver={this.dragOver.bind(this)}
            onDragLeave={this.dragLeave.bind(this)}
            ></div>
          <div
            className="transcription-editor"
            ref={this.editorRef}
            style={undockedStyle}
            draggable="true"
            onDragStart={this.startDrag.bind(this)}
            onDragEnd={this.endDrag.bind(this)}
            >
            {dragHandle}
            {resizeHandle}
              <div className="transcription-saving-container">
                <div className="transcription-saving">{this.state.saving}</div>
              </div>
              <textarea name={this.elementName}></textarea>
          </div>
        </div>
      </div>
    );
  }
}
