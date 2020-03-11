import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, Card } from 'antd';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { login } from '../../actions/user'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import './login.less'


const mapState = state => ({
  isLogin: state.user.isLogin,
  isLoading: state.user.isLoading
})

@connect(mapState, { login })
class Login extends Component {
  handleSubmit = (values) => {
    this.props.login(values)
  }

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  render() {
    return (
      this.props.isLogin
      ?
      <Redirect to='/admin' />
      :
      <Card
        title="登录"
        className="cj-login-wrapper"
      >
        <Form 
          onFinish={this.handleSubmit} 
          onFinishFailed={this.onFinishFailed}
          className="login-form" 
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            name='username'
            rules={[{ required: true, message: '用户名必须' }]}
          >
            <Input
              disabled={this.props.isLoading}
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
            />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[{ required: true, message: '密码必须' }]}
          >
              <Input
                disabled={this.props.isLoading}
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密码"
              />
          </Form.Item>
          <Form.Item>
            <Form.Item
              name='remember'
              valuePropName="checked"
              noStyle
            >
              <Checkbox disabled={this.props.isLoading} >记住我</Checkbox>
            
            </Form.Item>
            <Button loading={this.props.isLoading} type="primary" htmlType="submit" className="login-form-button">
                  登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}

export default Login