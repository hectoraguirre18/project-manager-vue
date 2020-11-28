import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Signup from '@/components/Signup'
import Dashboard from '@/components/Dashboard'
import ProjectForm from '@/components/projects/ProjectForm'
import Board from '@/components/projects/Board'
import store from '../store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {guest: true}
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
      meta: {guest: true}
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {requiresAuth: true}
    },
    {
      path: '/project/new',
      name: 'New Project',
      component: ProjectForm,
      meta: {requiresAuth: true}
    },
    {
      path: '/project/edit/:id',
      name: 'Edit Project',
      component: ProjectForm,
      meta: {requiresAuth: true}
    },
    {
      path: '/project/:id',
      name: 'Project Board',
      component: Board,
      meta: {requiresAuth: true}
    },
  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if(store.getters.isAuthenticated) {
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.guest)) {
    if (store.getters.isAuthenticated) {
      next('/dashboard');
    } else {
      next();
    }
  } else {
    next();
  }
});


export default router