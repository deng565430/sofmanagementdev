import React from 'react';
import { Tag, Input, Icon } from 'antd';

export default class EditableTagGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tags: [],
      inputVisible: false,
      inputValue: '',
      name: props.data.name + '备注',
      remarkFunc: props.remarkFunc
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      tags: nextProps.data.label
    })
  }

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
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
    this.props.remarkFunc(tags)
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  }

  saveInputRef = input => this.input = input

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    return (
      <div>
        {
          tags.length > 0 ? <Tag  color="#f50" closable afterClose={() => this.handleClose(tags[0])}>
            {tags[0]}
          </Tag> : null
        }
        {
          tags.length === 0
          ? <div>
            {
              inputVisible
              ? <Input
                  ref={this.saveInputRef}
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={inputValue}
                  onChange={this.handleInputChange}
                  onBlur={this.handleInputConfirm}
                   onPressEnter={this.handleInputConfirm}
                />
              : <Tag
                  onClick={this.showInput}
                  style={{ background: '#fff', borderStyle: 'dashed' }}
                >
                  <Icon type="plus" />{this.state.name}
                </Tag>
            }
          </div>  : null
        }
      </div>
    );
  }
}
