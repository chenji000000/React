import { 
    Dashboard,
    Login,
    NotFound,
    Settings,
    ArticleList,
    ArticleLEdit
} from "../views";

export const mainRouter = [{
    pathname:'/login',
    component: Login
},{
    pathname:'/404',
    component: NotFound
}]

export const adminRouter = [{
    pathname:'/admin/dashboard',
    component: Dashboard
},{
    pathname:'/admin/settings',
    component: Settings
},{
    pathname:'/admin/article',
    component: ArticleList,
    exact: true
},{
    pathname:'/admin/article/edit/:id',
    component: ArticleLEdit
}]