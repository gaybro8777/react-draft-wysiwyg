/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modifier, EditorState } from 'draft-js';

import LayoutComponent from './Component';

export default class Emoji extends Component {
  static propTypes: Object = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    modalHandler: PropTypes.object,
    config: PropTypes.object,
    translations: PropTypes.object,
  };

  state: Object = {
    expanded: false,
  };

  doExpand: Function = (): void => {
    this.setState({
      expanded: true,
    });
    setTimeout(() => {
      this.props.modalHandler.registerCallBack(this.doCollapse);
    }, 0);
  };

  doCollapse: Function = (): void => {
    this.setState({
      expanded: false,
    });
    this.props.modalHandler.deregisterCallBack(this.doCollapse);
  };

  addEmoji: Function = (emoji: string): void => {
    const { editorState, onChange } = this.props;
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      emoji,
      editorState.getCurrentInlineStyle(),
    );
    onChange(EditorState.push(editorState, contentState, 'insert-characters'));
    this.doCollapse();
  };

  render(): Object {
    const { config, translations } = this.props;
    const { expanded } = this.state;
    const EmojiComponent = config.component || LayoutComponent;
    return (
      <EmojiComponent
        config={config}
        translations={translations}
        onChange={this.addEmoji}
        expanded={expanded}
        onExpandEvent={this.doExpand}
        doExpand={this.doExpand}
        doCollapse={this.doCollapse}
        onCollpase={this.closeModal}
      />
    );
  }
}

// todo: unit test cases
