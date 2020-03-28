import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/user/users.vue'
import Rights from './components/power/Rights.vue'
import Roles from './components/power/Roles.vue'
import Cate from './components/goods/Cate.vue'
import Report from './components/report/Report.vue'

Vue.use(Router);

const router = new Router({
    routes: [
        {path: '/', redirect: '/login'},
        {path: '/login', component: Login},
        {path: '/home', component: Home, redirect: '/welcome', children:[{ // 子路由
            path: '/welcome', component:Welcome},
            {path:'/users', component:Users},
            {path:'/rights', component:Rights},
            {path:'/roles', component:Roles},
            {path:'/categories', component:Cate},
            {path:'/reports', component:Report},
            ]
        }
    ]
});

// 挂载路由导航守卫，使得未登录的用户无法访问相应的页面
router.beforeEach((to, from, next)=>{
    // to:将要访问 from:从哪里来 next:到哪里去
    if(to.path === '/login'){
        return next(); //直接放行
    }
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token');
    // console.log(tokenStr);
    if(!tokenStr) next('/login'); //强制跳转
    else next();
}) 

export default router;