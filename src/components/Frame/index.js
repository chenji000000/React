import React, { Component } from 'react'
import { 
    Layout,
    Menu,
    Badge,
    Dropdown,
    Avatar 
} from 'antd';
import { withRouter } from "react-router-dom"
import logo from './logo.png'
import "./frame.less"
import { connect } from 'react-redux'
import { getNotificationList } from '../../actions/notifications'
import { 
  DownOutlined 
} from '@ant-design/icons'
import { logout } from '../../actions/user'

const { Header, Content, Sider } = Layout;
const mapState = state => {
  return {
    notificationsCount: state.notifications.list.filter(item => item.hasRead === false).length,
    avatar: state.user.avatar,
    displayName: state.user.displayName
  }
}

@connect(mapState, { getNotificationList, logout })
@withRouter
class Frame extends Component {  
    componentDidMount () {
      this.props.getNotificationList()
    }

    onMenuClick = ({ key }) => {
        this.props.history.push(key)
    }
    
    onDropdownMenuClick = ({ key }) => {
        if (key === '/logout') {
          this.props.logout()
        } else {
          this.props.history.push(key)
        }
      }

    renderDropdown = () => (
        <Menu onClick={this.onDropdownMenuClick}>
          <Menu.Item
            key="/admin/notifications"
          >
            <Badge 
              dot={Boolean(this.props.notificationsCount)}
            >
              通知中心
            </Badge>
          </Menu.Item>
          <Menu.Item
            key="/admin/profile"
          >
            个人设置
          </Menu.Item>
          <Menu.Item
            key="/logout"
          >
            退出登录
          </Menu.Item>
        </Menu>
      )

    render() {
        const selectedKeysArr = this.props.location.pathname.split('/')
        selectedKeysArr.length = 3
        return (
            <Layout style={{minHeight:'100%'}}>
                <Header className="header cj-header">
                    <div className="cj-logo">
                        <img src={logo} alt=""/>
                    </div>
                    <div>
                    <Dropdown overlay={this.renderDropdown()}>
                        
                        <div 
                            style={{height:'100%', display: 'flex', alignItems:'center'}}
                        >
                            <Avatar 
                                src={this.props.avatar}
                            />
                            <span>欢迎您！{this.props.displayName}</span>
                            <Badge count={this.props.notificationsCount} offset={[-10, -10]}>
                                <DownOutlined />
                            </Badge>
                        </div>
                    </Dropdown>
                    </div>
                </Header>
                <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                    mode="inline"
                    selectedKeys={[selectedKeysArr.join('/')]}
                    onClick={this.onMenuClick}
                    style={{ height: '100%', borderRight: 0 }}
                    >
                        {
                            this.props.menus.map(item => {
                                return <Menu.Item 
                                           key={item.pathname}
                                        >
                                            <item.icon />
                                           {item.title}
                                       </Menu.Item>
                            })
                        }
                    </Menu>
                </Sider>
                <Layout style={{ padding: '16px' }}>
                    <Content
                    className="site-layout-background"
                    style={{
                        margin: 0,
                        backgroundColor: '#FFF'
                    }}
                    >
                    {this.props.children}
                    </Content>
                </Layout>
                </Layout>
            </Layout>
        )
    }
}


export default Frame