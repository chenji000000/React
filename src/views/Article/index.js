import React, { Component } from 'react'
import { 
    Card, 
    Button, 
    Table, 
    Tag, 
    message,
    Modal,
    Typography,
    Tooltip
} from 'antd'
import moment from 'moment'
import {getArticle, deleteArticleById} from '../../api'
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
            limited:10,
            isShowArticleModal: false,
            deleteArticleConfirmLoading: false,
            deleteArticleTitle: "",
            deleteArticleID: null
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
                        return (
                            <Tooltip title={amount > 200 ? "超过200" : "不到200"}>
                                <Tag color={amount > 200 ? "red" : "green"}>{record.amount}</Tag>
                            </Tooltip>
                        )
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
            render: (record) => {
                return (
                    <ButtonGroup>
                        <Button size="small" type="primary" onClick={this.onEdit.bind(this, record.id)}>编辑</Button>
                        <Button size="small" type="danger" onClick={this.onDelete.bind(this, record)}>删除</Button>
                    </ButtonGroup>
                )
                
            }
        })
        return columns
    }
// 编辑操作
    onEdit = (id) => {
        this.props.history.push(`/admin/article/edit/${id}`)
    }
// 删除操作(显示modal)
    onDelete = (record) => {
        this.setState({
            isShowArticleModal: true,
            deleteArticleTitle: record.title,
            deleteArticleID: record.id
        })
    }
// 隐藏modal
    hideDeleteModal =() => {
        this.setState({
            isShowArticleModal: false,
            deleteArticleConfirmLoading: false,
            deleteArticleTitle: ""
        })
    }

    // 真正删除操作
    deleteArticle = () => {
        this.setState({
            deleteArticleConfirmLoading: true
        })
        deleteArticleById(this.state.deleteArticleID)
        .then(resp => {
            message.success(resp.msg)
            this.setState({
                offset: 0
              }, () => {
                this.getData()
              })
        })
        .catch(err => {

        })
        .finally(() => {
            this.setState({
                deleteArticleConfirmLoading: false,
                isShowArticleModal: false
              })
        })
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
               <Modal
                    title='此操作不可逆，请谨慎！！！'
                    visible={this.state.isShowArticleModal}
                    onCancel={this.hideDeleteModal}
                    confirmLoading={this.state.deleteArticleConfirmLoading}
                    onOk={this.deleteArticle}
                >
                    <Typography>
                        确定要删除<span style={{color: '#f00'}}>{this.state.deleteArticleTitle}</span>吗？
                    </Typography>
                </Modal>
            </Card>
        )
    }
}
