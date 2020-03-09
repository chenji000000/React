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
        console.log(this.props)
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
                    selectedKeys={[this.props.location.pathname]}
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
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
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