import React from 'react';
import { Form, Icon, Input, Button, Checkbox, Row, Col  } from 'antd';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import {login} from '../../redux/user.redux'
const FormItem = Form.Item;

@connect(
	state=>state.user,
	{login}
)
class NormalLoginForm extends React.Component {
  state = {
    val: 0
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { userName, password, remember } = values
       /*  const username = '13127885981';
        const password = 'sof123456';
        const remember = true; */
        this.props.login({ username: userName, password, remember });
      }
    });
  // {(this.props && this.props.redirectTo && this.props.redirectTo !== '/login') ? <Redirect to={this.props.redirectTo} /> : null}  
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
      {(this.props && this.props.redirectTo && this.props.redirectTo !== '/login') ? <Redirect to={this.props.redirectTo} /> : null}  
      <Row type="flex" justify="space-around" align="middle">
        <Col span={9} />
        <Col span={6} style={{paddingTop: '10%'}}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '请输入用户名！' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入用户名" />
                )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码！' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" />
                )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>保存密码</Checkbox>
                )}
              <Button type="primary" htmlType="submit" className="login-form-button">
               登录
          </Button>
            </FormItem>
          </Form>
        </Col>
        <Col span={9} />
      </Row>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
export default WrappedNormalLoginForm;
