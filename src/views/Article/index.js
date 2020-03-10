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
import XLSX from 'xlsx'

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
            isLoading: false,
            offset:0,
            limited:10
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

    onPageChange = (page, pageSize) => {
        console.log(page, pageSize)
        this.setState({
            offset: pageSize*(page - 1),
            limited: pageSize
        }, () => {
            this.getData()
        })
    }

    onShowSizeChange = (current, size) => {
        this.setState({
            offset: 0,
            limited: size
        }, () => {
            this.getData()
        })
    }
// 导出Excel
    toExcel = () => {
        const data = [Object.keys(this.state.dataSource[0])] //[["a","b"],[1,2]]
        for (let i = 0; i < this.state.dataSource.length; i++) {
            data.push([
                this.state.dataSource[i].id,
                this.state.dataSource[i].title,
                this.state.dataSource[i].author,
                this.state.dataSource[i].amount,
                moment(this.state.dataSource[i].createAt).format('YYYY-MM-DD HH:mm:ss')
            ])
        }

        /* convert state to workbook */
		const ws = XLSX.utils.aoa_to_sheet(data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
		/* generate XLSX file and send to client */
		XLSX.writeFile(wb, `articles-${this.state.offset / this.state.limited + 1}-${moment().format('YYYYMMDDhhmmss')}.xlsx`)
    }

    getData = () => {
        this.setState({
            isLoading: true
        })
        getArticle(this.state.offset, this.state.limited)
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
            extra={<Button onClick={this.toExcel}>导出Excel</Button>}>
               <Table
                 rowKey={record=> record.id} 
                 dataSource={this.state.dataSource} 
                 columns={this.state.columns}
                 loading={this.state.isLoading}
                 pagination={{
                     current:this.state.offset / this.state.limited + 1,
                     total: this.state.total,
                     hideOnSinglePage: true,
                     showQuickJumper: true,
                     showSizeChanger: true,
                     onChange: this.onPageChange,
                     onShowSizeChange: this.onShowSizeChange
                 }}
               >

               </Table> 
            </Card>
        )
    }
}
