import React from 'react';
import { Layout, Menu, Button, Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import browserCookie from 'browser-cookies'

import { logoutSubmit } from '../../redux/user.redux';
import { getTable, showDataList } from '../../redux/userdata.redux';
import { leftmenu } from '../../api/user';

import Home from '../home/home';
import Leftmenu from '../leftmenu/leftmenu';
import './dashboard.css';

const { Header, Content, Sider, Footer } = Layout;

@withRouter
@connect(
  state =>state,
    { logoutSubmit, getTable, showDataList }
)
class Dashborad extends React.Component {
  state = {
    leftmenu: [],
    promote: ''
  }
  componentWillMount() {
    // 获取用户信息
    const phone = browserCookie.get('phone')
    const path = this.props.location.pathname.split('/')[2] || 'all'
    if (phone) {
      leftmenu().then(res => {
        if (res.data.code === 0) {
          // const promote = /\d/.exec(res.data.data[1].value)[0]
          this.props.getTable({sign: path})
          this.setState({
            leftmenu: res.data.data
          })
        }
      })
    }
  }

  // 退出登录
  logout() {
    const confirm = Modal.confirm
    const logoutSubmit = this.props.logoutSubmit;
    const history = this.props.history;
    confirm({
      title: '提示',
      content: '是否确定退出登录？',
      okText: '是的',
      okType: 'danger',
      cancelText: '再看看',
      onOk() {
        browserCookie.erase('phone')
        browserCookie.erase('username')
        logoutSubmit();
        history.push('/login')
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  
  render() {
    const props = this.props.user
    return (
      <Layout>
        <Header id='components-layout-demo-top'>
          <div className="logo" >上富CRM</div>
          <div className="logo left-menu" >业务管理</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            className='center'
            style={{ lineHeight: '44px', flex: 1 }}
          >
            
          </Menu>
          {
            props.phone
              ? <div style={{ color: 'white', lineHeight: '44px' }}>欢迎您：{props.phone}  &nbsp;
                  <Button type="danger" onClick={() => this.logout()}>退出</Button>
                </div>
              : null
          }
        </Header>
        <Layout>
          <Sider width={140} style={{ background: '#fff' }}>
            <Leftmenu data={this.state.leftmenu} />
          </Sider>
          <Layout>
          <Content style={{ background: '#edf1f6', padding: 3, margin: 0, minHeight: 280 }}>
              <div>
                <Home />
            </div>
          </Content>
          </Layout>
        </Layout>
        <Footer style={{display: 'none'}}>footer</Footer>
      </Layout>
    )
  }
}

export default Dashborad;
