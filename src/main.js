import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
import echarts from "echarts";
Vue.prototype.$echarts = echarts;

// 配置请求的根路径
axios.defaults.baseURL = "http://timemeetyou.com:8889/api/private/v1/"
// 拦截请求，以在请求头中添加token令牌
axios.interceptors.request.use(config=>{
    console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token');
    // 在最后必须返回config
    return config;
})

Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
