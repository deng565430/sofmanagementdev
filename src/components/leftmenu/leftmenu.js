import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { getTable } from '../../redux/userdata.redux';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;

@connect(
  null,
  { getTable }
)
@withRouter
class Leftmenu extends React.Component {
  constructor(props) {
    super(props)
    const path = this.props.location.pathname.split('/')[2] || 'all'
    const openKeys = decodeURI(this.props.location.pathname.split('/')[1] || '所有')
    this.state = {
      defaultSelectedKeys: path,
      openKeys: openKeys
    }
  }
  
  onOpenChange(path) {
    this.setState({
      openKeys: path[1]
    })
  }

  changeItem({ item, key, keyPath }) {
    if (this.state.defaultSelectedKeys === keyPath[0]) {
      return
    }
    const openKeys = encodeURI(this.state.openKeys)
    this.props.history.push(`/${openKeys}/${keyPath[0]}`)
    const dataList = {
      sign: keyPath[0]
    }
    this.props.getTable(dataList)
    this.setState({
      defaultSelectedKeys: keyPath[0]
    })
  }

  render() {
    const { data } = this.props
    return (
      <Menu
        mode="inline"
        inlineIndent={10}
        selectedKeys={[this.state.defaultSelectedKeys]}
        openKeys={[this.state.openKeys]}
        theme='dark'
        onOpenChange={(v) => this.onOpenChange(v)}
        onClick={({ item, key, keyPath }) => this.changeItem({ item, key, keyPath })}
        style={{ height: '100%', borderRight: 0, width: '140px' }}
      >
        {data.map(v => (
          <SubMenu key={v.key} title={<span>{v.key}</span>}>
            {
              Array.isArray(v.value)
              ? v.value.map(k => {
                return (
                  k.key !== 'practice4'
                    ? <Menu.Item
                      key={k.key}
                      style={{ height: '35px', lineHeight: '35px' }}
                    >
                      {k.value}
                    </Menu.Item>
                    : null
                )
              })
                : <Menu.Item
                  key='all'
                  style={{ height: '35px', lineHeight: '35px' }}
                >
                  暂无
                </Menu.Item>
            }
          </SubMenu>
        ))}
      </Menu>
    )
  }
}

export default Leftmenu;
