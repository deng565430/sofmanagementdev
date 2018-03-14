import React from 'react';
import { connect } from 'react-redux';
import { loadData, logoutSubmit} from '../../redux/user.redux';
import { withRouter } from 'react-router-dom';
import browserCookie from 'browser-cookies';

@withRouter
@connect(
  null,
  { loadData,logoutSubmit }
)
class AuthRoute extends React.Component{
  componentDidMount() {
    const publicList = ['/login', '/register'];
    const pathname = this.props.location.pathname;
    if (publicList.indexOf(pathname) > -1) {
      return null
    }
    // 获取用户信息
    const phone = browserCookie.get('phone')
    if (phone) {
      this.props.loadData({ phone})
    } else {
      this.props.history.push('/login')
    }
  }
  render() {
    return null
  }
}

export default AuthRoute
