import React from 'react';
import { Tag, Input, Tooltip, Icon } from 'antd';


class EditableTagGroup extends React.Component {
  state = {
    tags: [],
    inputVisible: false,
    inputValue: '',
  };

  componentWillReceiveProps(nexprop) {
    if (nexprop.labels) {
      this.setState({
        tags: nexprop.labels
      })
    }
  }
  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
    // 搜索标签
    if (this.props.handleInputConfirm) {
      this.props.handleInputConfirm(tags);
    }
    // 右侧详情自定义标签
    if (this.props.rightHandleInputConfirm) {
      this.props.rightHandleInputConfirm(tags);
    }
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
    // 传递数据给父组件 搜索标签
    if (this.props.handleInputConfirm) {
      this.props.handleInputConfirm(tags);
    }
    // 右侧详情自定义标签
    if (this.props.rightHandleInputConfirm) {
      this.props.rightHandleInputConfirm(tags);
    }
  }

  saveInputRef = input => this.input = input

  render() {
    let { tags, inputVisible, inputValue } = this.state;
    return (
      <div>
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} color="#108ee9" closable afterClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
        })}
        {inputVisible
          ?
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
          :
          <Tag
            onClick={this.showInput}
            style={{ background: '#fff', borderStyle: 'dashed' }}
          >
            <Icon type="plus" />
          </Tag>
        }
      </div>
    );
  }
}

export default EditableTagGroup;
