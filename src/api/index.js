import axios from 'axios'
import { message } from 'antd'

const isDev = process.env.NODE_ENV === 'development'

const service = axios.create({
    baseURL: isDev ? 'http://rap2api.taobao.org/app/mock/176929' : ''
})

service.interceptors.request.use((config) => {
    config.data = Object.assign({}, config.data, {
        authToken: "dhajdhjhdjahdjhjhdh"
    })
    return config
})

service.interceptors.response.use((resp) => {
    if (resp.status === 200) {
        return resp.data.data
    } else {
        message.error(resp.data.errMsg)
    }
})

export const getArticle = (offset = 0, limited = 10) => {
    return service.post('/api/v1/articleList', {
        offset,
        limited
    })
}