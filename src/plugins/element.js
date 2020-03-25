import Vue from 'vue'
// message是弹框提示组件
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);

// 把message挂载到vue的原型中
Vue.prototype.$message = Message;