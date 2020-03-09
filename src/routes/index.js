import { 
    Dashboard,
    Login,
    NotFound,
    Settings,
    ArticleList,
    ArticleLEdit
} from "../views";
import { 
    DashboardOutlined, 
    UnorderedListOutlined, 
    SettingOutlined 
} from '@ant-design/icons'

export const mainRouter = [{
    pathname:'/login',
    component: Login
},{
    pathname:'/404',
    component: NotFound
}]

export const adminRouter = [{
    pathname:'/admin/dashboard',
    component: Dashboard,
    title: "仪表盘",
    isNav: true,
    icon: DashboardOutlined
},{
    pathname:'/admin/article',
    component: ArticleList,
    exact: true,
    title: "文章管理",
    isNav: true,
    icon: UnorderedListOutlined
},{
    pathname:'/admin/article/edit/:id',
    component: ArticleLEdit
},{
    pathname:'/admin/settings',
    component: Settings,
    title: "设置",
    isNav: true,
    icon: SettingOutlined
}]