import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
import echarts from "echarts";
Vue.prototype.$echarts = echarts;
// 导入NProgress包对应的JS CSS
import Nprogress from "nprogress"
import 'nprogress/nprogress.css'
// 配置请求的根路径
axios.defaults.baseURL = "http://timemeetyou.com:8889/api/private/v1/"

// 在request拦截器中展示进度条NProgress.start()
// 拦截请求，以在请求头中添加token令牌
axios.interceptors.request.use(config=>{
    Nprogress.start();
    config.headers.Authorization = window.sessionStorage.getItem('token');
    // 在最后必须返回config
    return config;
})

// 在response拦截器中 隐藏进度条 Nprogress.done()
axios.interceptors.response.use(config=>{
    Nprogress.done();
    // 在最后必须返回config
    return config;
})

Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
