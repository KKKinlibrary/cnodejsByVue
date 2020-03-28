import Vue from 'vue'
// message是弹框提示组件
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Switch,
        Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Col, Row, Table, TableColumn,
        Tooltip, Pagination, Dialog, MessageBox, Tag, Tree, Select, Option
} from 'element-ui'

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Select);
Vue.use(Option);

// 把message挂载到vue的原型中
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;