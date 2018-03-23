import React from 'react';
import { Input, Icon } from 'antd';
import { trims } from '../../util/util';
import { error } from "../message/message";

const Search = Input.Search;


export default class Tables extends React.Component {
  state = {
    value: ''
  }
  searchPhone(value) {
    if (/^1[3|4|5|7|8]\d{9}$/.test(trims(value))) {
      this.props.searchPhone(trims(value))
    } else {
      error('请重新输入电话号码')
    }
  }
  clearValue() {
    if (trims(this.state.value) === '') return;
    this.setState({value: ''})
    if (!/^1[3|4|5|7|8]\d{9}$/.test(trims(this.state.value))) return;
    this.props.closeSearch()
  }
  render() {
    return (
      <Search
        ref="search"
        value={this.state.value}
        onChange={(e) => this.setState({ value: e.target.value})}
        placeholder="输入电话号码"
        onSearch={value => this.searchPhone(value)}
        onPressEnter={e => this.searchPhone(e.target.value)}
        prefix={<Icon type="close" onClick={() => this.clearValue()}/>}
        enterButton
      />
    )
  }
}
