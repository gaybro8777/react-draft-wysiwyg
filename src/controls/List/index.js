/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RichUtils } from 'draft-js';
import { changeDepth, getBlockBeforeSelectedBlock, getSelectedBlock, isListBlock } from 'draftjs-utils';

import LayoutComponent from './Component';

export default class List extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object.isRequired,
    modalHandler: PropTypes.object,
    config: PropTypes.object,
    translations: PropTypes.object,
  };

  state: Object = {
    expanded: false,
    currentBlock: undefined,
  };

  componentWillMount(): void {
    const { editorState, modalHandler } = this.props;
    if (editorState) {
      this.setState({ currentBlock: getSelectedBlock(editorState) });
    }
  }

  componentWillReceiveProps(properties: Object): void {
    if (properties.editorState &&
      this.props.editorState !== properties.editorState) {
      const currentBlock = getSelectedBlock(properties.editorState);
      this.setState({ currentBlock: getSelectedBlock(properties.editorState) });
    }
  }

  onChange: Function = (value: string): void => {
    if (value === 'unordered') {
      this.toggleBlockType('unordered-list-item');
    } else if (value === 'ordered') {
      this.toggleBlockType('ordered-list-item');
    } else if (value === 'indent') {
      this.adjustDepth(1);
    } else {
      this.adjustDepth(-1);
    }
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

  toggleBlockType: Function = (blockType: String): void => {
    const { onChange, editorState } = this.props;
    const newState = RichUtils.toggleBlockType(
      editorState,
      blockType,
    );
    if (newState) {
      onChange(newState);
    }
  };

  adjustDepth: Function = (adjustment): void => {
    const { onChange, editorState } = this.props;
    const newState = changeDepth(
      editorState,
      adjustment,
      4,
    );
    if (newState) {
      onChange(newState);
    }
  };

  isIndentDisabled = () => {
    const { editorState } = this.props;
    const { currentBlock } = this.state;
    const previousBlock = getBlockBeforeSelectedBlock(editorState);
    if (!previousBlock ||
      !isListBlock(currentBlock) ||
      (previousBlock.get('type') !== currentBlock.get('type')) ||
      (previousBlock.get('depth') < currentBlock.get('depth'))
    ) {
      return true;
    }
    return false;
  }

  isOutdentDisabled = () => {
    const { currentBlock } = this.state;
    return !currentBlock || !isListBlock(currentBlock) || currentBlock.get('depth') <= 0;
  }

  render(): Object {
    const { config, translations } = this.props;
    const { expanded, currentBlock } = this.state;
    const ListComponent = config.component || LayoutComponent;
    let listType;
    if (currentBlock.get('type') === 'unordered-list-item') {
      listType = 'unordered';
    } else if (currentBlock.get('type') === 'ordered-list-item') {
      listType = 'ordered';
    }
    const indentDisabled = this.isIndentDisabled();
    const outdentDisabled = this.isOutdentDisabled();
    return (
      <ListComponent
        config={config}
        translations={translations}
        currentState={{ listType }}
        expanded={expanded}
        onExpandEvent={this.doExpand}
        doExpand={this.doExpand}
        doCollapse={this.doCollapse}
        onChange={this.onChange}
        indentDisabled={indentDisabled}
        outdentDisabled={outdentDisabled}
      />
    );
  }
}
