import React, { Component } from 'react'
import { 
    Card, 
    Button, 
    Table, 
    Tag, 
    message
} from 'antd'
import moment from 'moment'
import {getArticle} from '../../api'

const titleDisplayMap = {
    id: "id",
    title: "标题",
    author: "作者",
    createAt: "创建时间",
    amount: "阅读量"
}
const ButtonGroup = Button.Group

export default class Article extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataSource : [],
            columns : [],
            total : 0,
            isLoading: false
        }
    }

    createColums = (ccolumnKeys) => {
        const columns = ccolumnKeys.map((item) => {
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
            if (item === "createAt") {
                return {
                    title: titleDisplayMap[item],
                    key: item,
                    render: (text, record) => {
                        const {createAt} = record
                        return moment(createAt).format("YYYY-MM-DD hh:mm:ss")
                    }
                }
            }
            return {
                title: titleDisplayMap[item],
                dataIndex: item,
                key: item
            }
        }) 
        columns.push({
            title: "操作",
            key: "action",
            render: () => {
                return (
                    <ButtonGroup>
                        <Button size="small" type="primary">编辑</Button>
                        <Button size="small" type="danger">删除</Button>
                    </ButtonGroup>
                )
                
            }
        })
        return columns
    }

    getData = () => {
        this.setState({
            isLoading: true
        })
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
            .catch(err => {
                message.error(err)
            })
            .finally( ()=> {
                this.setState({
                    isLoading: false
                })
            }

            )
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
                 rowKey={record=> record.id} 
                 dataSource={this.state.dataSource} 
                 columns={this.state.columns}
                 loading={this.state.isLoading}
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
