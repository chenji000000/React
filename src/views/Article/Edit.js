import React, { Component, createRef } from 'react'
import {
    Card, 
    Button,
    Form,
    DatePicker,
    Input,
    Spin,
    message,
    InputNumber
} from 'antd'
import moment from 'moment'
import E from 'wangeditor'
import './edit.less'
import { getArticleById, saveArticle } from '../../api'

const formItemLayout = {
    labelCol: {
      span: 4
    },
    wrapperCol: {
      span: 16
    }
}

class Edit extends Component {

    constructor(props) {
        super(props) 
        this.editorRef = createRef()
        this.state = {
            isLoading: false
        }
    }

    initEditor = () => {
        this.editor = new E(".cj-editor")
        this.editor.customConfig.onchange = (html) => {
          // html 即变化之后的内容
          console.log(html)
          this.editorRef.current.setFieldsValue({
            content: html
          })
        }
        this.editor.create()
      }

    handleSubmit = (values) => {
        const data = Object.assign({}, values, {
            createAt: values.createAt.valueOf()
          })
          this.setState({
            isLoading: true
          })
          // 在这里可以处理更多想要处理的逻辑
          saveArticle(this.props.match.params.id, data)
            .then(resp => {
              message.success(resp.msg)
              // 如果需要是要跳转
              this.props.history.push('/admin/article')
            })
            .finally(() => {
              this.setState({
                isLoading: false
              })
            })
    }

    getArticle = () => {
        this.setState({
            isLoading: true
          })
          getArticleById(this.props.match.params.id)
            .then(resp => {
              const { id, ...data } = resp
              data.createAt = moment(data.createAt)
              this.editorRef.current.setFieldsValue(data)
              this.editor.txt.html(data.content)
            })
            .finally(() => {
              this.setState({
                isLoading: false
              })
            })
    }

    componentDidMount() {
        this.initEditor()
        this.getArticle()
    }

    render() {   
        return (
            <Card
                title="编辑文章"
                bordered={false}
                extra={<Button onClick={this.props.history.goBack}>取消</Button>}
            >
                <Spin spinning={this.state.isLoading}>
                    <Form
                        onFinish={this.handleSubmit}
                        ref={this.editorRef}
                        {...formItemLayout}
                    >
                        <Form.Item
                        label="标题"
                        name='title'
                        rules={[
                            {
                                required: true,
                                message: '标题是必填的'
                            }
                        ]}
                        >
                            <Input
                            placeholder="标题"
                            />
                        </Form.Item>
                        <Form.Item
                        label="作者"
                        name='author'
                        rules={[
                            {
                                required: true,
                                message: '作者是必填的'
                            }
                        ]}
                        >
                            <Input
                            placeholder="admin"
                            />
                        </Form.Item>
                        <Form.Item
                        label="阅读量"
                        name='amount'
                        rules={[
                            {         
                                required: true,
                                message: '阅读量是必填的',
                                type: 'number',
                                min: 0
                            }
                        ]}
                        >
                            <InputNumber
                            placeholder="0"
                            style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item
                        label="发布时间"
                        name='createAt'
                        rules={[
                            {
                                required: true,
                                message: '时间是必须的'
                            }
                        ]}
                        >
                            <DatePicker 
                                showTime 
                                placeholder="选择时间" 
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item
                        label="内容"
                        name='content'
                        rules={[
                            {
                                required: true,
                                message: '内容是必须的'
                            }
                        ]}
                        >
                            <div className="cj-editor" />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 4 }}>
                            <Button type="primary" htmlType="submit">
                                保存修改
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        )
    }
}

export default Edit
