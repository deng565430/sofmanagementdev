import React from 'react';
import { Input, Icon } from 'antd';
import { trims } from '../../util/util';

const Search = Input.Search;


export default class Tables extends React.Component {
  state = {
    value: ''
  }
  searchPhone(value) {
    this.props.searchPhone(trims(value))
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
        prefix={<Icon type="close" onClick={() => this.setState({value: ''})}/>}
        enterButton
      />
    )
  }
}
