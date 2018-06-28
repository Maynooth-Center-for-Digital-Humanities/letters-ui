import React from 'react';
import { EditorState,convertToRaw,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {editorImportTranscription,editorExportTranscription,replaceTag} from '../../helpers/xml-editor/xml-editor';
import replaceTagsSource from '../../helpers/xml-editor/replace-tags-tap.json';

export default class TranscriptionEditor extends React.Component {
  constructor(props) {
    super(props);

    let contentMarkup = this.props.page.transcription;

    let replaceXMLTags = replaceTag(contentMarkup, replaceTagsSource);
    //console.log(test);
    //contentMarkup = replaceTag(contentMarkup, replaceTagsSource);
    let contentBlock = htmlToDraft(replaceXMLTags, (nodeName, node) => {
      if (nodeName === 'lb') {
        return {
          type: 'LINE_BREAK',
          mutability: 'MUTABLE',
          data: {}
        };
      }
    });
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      };
    }
    this.updateContentState = this.updateContentState.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.outputTranscription = this.outputTranscription.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.page.transcription!==this.props.page.transcription) {
      let contentMarkup = newProps.page.transcription;
      let contentBlock = htmlToDraft(contentMarkup);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.setState({
          editorState,
        });
      }
    }
  }

  updateContentState() {

  }

  onEditorStateChange(editorState) {
    this.setState({
      editorState,
    });
  }



  outputTranscription() {
    let transcription = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
    console.log(editorExportTranscription(transcription));
  }

  render() {
    let {editorState} = this.state;
    let toolbarOptions = {
      inline: {
        inDropdown: false,
        options: ['underline', 'strikethrough','superscript', 'subscript']
      },
      blockType: {
        inDropdown: false,
        options: [],
        className: 'hidden'
      },
      fontSize: {
        inDropdown: false,
        options: [],
        className: 'hidden'
      },
      fontFamily: {
        inDropdown: false,
        options: [],
        className: 'hidden'
      },
      list: {
        options: [],
        className: 'hidden'
      },
      textAlign: {
        options: [],
        className: 'hidden'
      },
      colorPicker: {
        options: [],
        className: 'hidden'
      },
      link: {
        options: [],
        className: 'hidden'
      },
      emoji: {
        options: [],
        className: 'hidden'
      },
      embedded: {
        options: [],
        className: 'hidden'
      },
      image: {
        options: [],
        className: 'hidden'
      },
      remove: {
        options: [],
        className: 'hidden'
      },
      history: { inDropdown: false },
    };
    const blockRenderMap = DefaultDraftBlockRenderMap.merge(
      Immutable.Map({
        'header-six': {
          wrapper: <Hello/>
        }
      })
    );
    return (
      <div>
        <Editor
          blockRenderMap={blockRenderMap}
          toolbarClassName="transcription-editor-toolbar"
          toolbar={toolbarOptions}
          editorState={editorState}
          wrapperClassName="transcription-editor-container"
          editorClassName="transcription-editor-body"
          onEditorStateChange={this.onEditorStateChange}
        />
        <textarea
          cols="100"
          rows="6"
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        />
        <br/>
        <button onClick={this.outputTranscription}>Test</button>
      </div>
    );
  }
}
