import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/main.vue'
import Home from "../views/home.vue"
import Users from "../views/users.vue"
import Department from "../views/department.vue"
import Images from "../views/images.vue"
import Account from "../views/account.vue"
import Login from "../views/login"
import {Message} from "element-ui"
import Files from "../views/files.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Main,
    children:[
      {path:"/",component:Home},
      {path:"/users",component:Users},
      {path:"/departments",component:Department},
      {path:"/images",component:Images},
      {path:"/account",component:Account},
      {path:"/files",component:Files},
    ]
  },
  {
    path: '/login',
    component: Login,
    meta: {
      ispublic: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (!to.meta.ispublic && !sessionStorage.token) {
    Message({type:"warning",message:"请登录"})
    return next('/login')
  }
  next()
})


export default router
