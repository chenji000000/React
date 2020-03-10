import React, { Component } from 'react'
import { Layout, Menu } from 'antd';
import { withRouter } from "react-router-dom"
import logo from './logo.png'
import "./frame.less"

const { Header, Content, Sider } = Layout;

@withRouter
class Frame extends Component {  
    onMenuClick = ({ key }) => {
        this.props.history.push(key)
    }

    render() {
        const selectedKeysArr = this.props.location.pathname.split('/')
        selectedKeysArr.length = 3
        return (
            <Layout style={{minHeight:'100%'}}>
                <Header className="header cj-header">
                    <div className="cj-logo">
                        <img src={logo} alt=""/>
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