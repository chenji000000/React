import React, { Component } from 'react'
import { Card, Button, Table, Tag } from 'antd'
import {getArticle} from '../../api'

const titleDisplayMap = {
    id: "id",
    title: "标题",
    author: "作者",
    createAt: "创建时间",
    amount: "阅读量"
}

export default class Article extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataSource : [],
            columns : [],
            total : 0
        }
    }

    createColums = (ccolumnKeys) => {
        return ccolumnKeys.map((item) => {
            if (item === "amount") {
                return {
                    title: titleDisplayMap[item],
                    key: item,
                    render: (text, record) => {
                        const {amount} = record
                        return <Tag color={amount > 200 ? "red" : "green"}>{record.amount}</Tag>
                    }
                }
            }
            return {
                title: titleDisplayMap[item],
                dataIndex: item,
                key: item
            }
        }) 
    }

    getData = () => {
        getArticle()
            .then(resp => {
                const columnKeys = Object.keys(resp.list[0])
                const columns = this.createColums(columnKeys)
                this.setState({
                    total: resp.total,
                    dataSource: resp.list,
                    columns 
                })
            })
    }

   componentDidMount() {
        this.getData()
   }
    render() {
        return (
            <Card 
            title="文章列表" 
            bordered={false}
            extra={<Button>导出Excel</Button>}>
               <Table 
                 dataSource={this.state.dataSource} 
                 columns={this.state.columns}
                 pagination={{
                     total: this.state.total,
                     hideOnSinglePage: true
                 }}
               >

               </Table> 
            </Card>
        )
    }
}
