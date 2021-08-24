import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

// Component Imports
import User from './components/user/User.vue'
import Home from './components/Home.vue'
import Projects from './components/projects/Projects.vue'
import ProjectView from './components/projects/ProjectView.vue'
import Environemnt from './components/Environment.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Deploys from './components/Deploys.vue'
import SetupGuide from './components/SetupGuide.vue'

Vue.use(VueRouter);

export const routes = [
  {
    name: 'home',
    path: '',
    component: Home
  },
  {
    path: '/login',
    component: Login,
    meta: { guest: true },
  },
  {
    path: '/register',
    component: Register,
    meta: { guest: true },
  },
  {
    path: '/user',
    component: User,
    // meta: { requiresAuth: true },
  },
  {
    path: '/setupguide',
    component: SetupGuide,
    // meta: { requiresAuth: true },
  },
  {
    path: '/projects',
    component: Projects,
    // meta: { requiresAuth: true },
  },
  {
    path: '/environment/:environmentId/:methodName/:projectId',
    component: Environemnt,
    // meta: { requiresAuth: true },
  },
  {
    path: '/project/:projectId/:deployName',
    component: ProjectView,
    // meta: { requiresAuth: true },
  },
  {
    path: '/deployjob/:projectId',
    component: Deploys,
    // meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

// Handling routes with Authentification Required
router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if(store.getters.isAuthenticated) {
      next()
      return
    }
    next('/login')
  } else {
    next ()
  }
});

// Handling routes with Guest permitted
router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.guest)) {
    if(store.getters.isAuthenticated) {
      next('/projects')
      return;
    }
    next()
  } else {
    next()
  }
});

export default router;
