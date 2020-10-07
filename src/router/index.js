import Vue from 'vue'
import Router from 'vue-router'
import Home from '../page/home'
import ArticleList from '../page/article/articleList';
import DiscussList from '../page/article/discuss/disussList';
import UserList from '../page/user/userList';
import LoginHistory from '../page/user/loginHistory';
import Config from '../page/system/config';
import Db from '../page/system/db';
import WebUser from '../page/website/webUser'
import WebData from '../page/website/webData'
import MessageManager from '../page/website/messageManager'
import Setting from '../page/personCenter/setting';
import OperationRecord from '../page/personCenter/operationRecord'
import Login from '../page/login/login'
import NotFound from '../page/error/notFound';

import 'iview/dist/styles/iview.css';
import '../../static/js/iconfont.js'
import '../../static/js/jquery-1.11.3.min.js';
import '../utils/myUtils'
import '../utils/vue-global'
import '../utils/myGlobal'
import '../utils/axios'

Vue.use(Router);
export default new Router({
  mode: 'history',
  routes: [
    {
      name: 'login',
      path: '/',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      meta: {
        requireAuth: true,
        roles: ['admin']
      },
      children: [
        {
          name: 'articleList',
          path: 'articleList',
          component: ArticleList
        },
        {
          name: 'discussList',
          path: 'discussList',
          component: DiscussList
        },
        {
          name: 'userList',
          path: 'userList',
          component: UserList
        },
        {
          name: 'loginHistory',
          path: 'loginHistory',
          component: LoginHistory
        },
        {
          name: 'config',
          path: 'config',
          component: Config
        },
        {
          name: 'db',
          path: 'db',
          component: Db
        },
        {
          name: 'webUser',
          path: 'webUser',
          component: WebUser
        },
        {
          name: 'webData',
          path: 'webData',
          component: WebData
        },
        ,
        {
          name: 'messageManager',
          path: 'messageManager',
          component: MessageManager
        },
        {
          name: 'setting',
          path: 'setting',
          component: Setting
        },
        ,
        {
          name: 'operationRecord',
          path: 'operationRecord',
          component: OperationRecord
        }, {
          path: '*',
          name: 'notFound',
          component: NotFound
        }
      ]
    }
  ]
})
