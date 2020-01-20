import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Workspace from '../views/Workspace.vue';
import Lab from '../views/Lab.vue';
import Sandbox from '../views/Sandbox.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Sandbox
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
