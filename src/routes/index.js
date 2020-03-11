import { 
    Dashboard,
    Login,
    NotFound,
    Settings,
    ArticleList,
    ArticleLEdit,
    Notifications
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
    icon: DashboardOutlined,
    roles: ['001', '002', '003']
},{
    pathname:'/admin/article',
    component: ArticleList,
    exact: true,
    title: "文章管理",
    isNav: true,
    icon: UnorderedListOutlined,
    roles: ['001', '002']
},{
    pathname:'/admin/article/edit/:id',
    component: ArticleLEdit,
    roles: ['001', '002']
},{
    pathname:'/admin/settings',
    component: Settings,
    title: "设置",
    isNav: true,
    icon: SettingOutlined,
    roles: ['001']
},{
    pathname:'/admin/notifications',
    component: Notifications,
    roles: ['001', '002', '003']
}]