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
// 获取文章列表
export const getArticle = (offset = 0, limited = 10) => {
    return service.post('/api/v1/articleList', {
        offset,
        limited
    })
}

// 删除文章
export const deleteArticleById = (id) => {
    return service.post(`/api/v1/articleDelete/${id}`)
}

// 通过id获取文章
export const getArticleById = (id) => {
    return service.post(`/api/v1/article/${id}`)
}
  
  // 保存文章
 export const saveArticle = (id, data) => {
    return service.post(`/api/v1/articleEdit/${id}`, data)
}