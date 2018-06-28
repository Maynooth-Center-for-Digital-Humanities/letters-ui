import React from 'react';
import 'draft-js/dist/Draft.css';
import Immutable from 'immutable';
import {Editor, EditorState, ContentState, convertFromHTML, convertFromRaw, convertToRaw, RichUtils, DefaultDraftBlockRenderMap} from 'draft-js';

const blockRenderMap = Immutable.Map({
  'address': {
    element: 'p',
    //wrapper: <MyCustomBlock {...this.props} />
  }
});

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

export default class TranscriptionEditor extends React.Component {
  constructor(props) {
    super(props);

    let contentHTML = this.props.page.transcription;

    let blocksFromHTML = convertFromRaw(contentHTML);
    console.log(blocksFromHTML);
    let state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );

    this.state = {
      editorState: EditorState.createWithContent(state),
    };

    this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.consoleLog = this.consoleLog.bind(this);
  }

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  componentWillReceiveProps(newProps){
    let contentHTML = newProps.page.transcription;

    let blocksFromHTML = convertFromRaw(contentHTML);

    let state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    this.setState({
      editorState: EditorState.createWithContent(state),
    })

  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  consoleLog() {
    console.log(convertToRaw(this.state.editorState.ContentState));
  }

  render() {

    return (
      <div className="transcription-editor-container">
        <ul className="transcription-editor-toolbar">
          <li>
            <div onClick={this._onBoldClick.bind(this)}>B</div>
          </li>
        </ul>
        <div className="transcription-editor-body">
          <Editor
            blockRenderMap={extendedBlockRenderMap}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
          />
        </div>
        <button onClick={this.consoleLog}>Test</button>
      </div>
    );
  }
}
