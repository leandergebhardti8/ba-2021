import User from './components/user/User.vue'
import Home from './components/Home.vue'
import Project from './components/projects/Project.vue'
import Environemnt from './components/Environment.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'

export const routes = [
  {
    path: '',
    component: Home
  },
  {
    path: '/user/:id',
    component: User
  },
  {
    path: '/projects',
    component: Project
  },
  {
    path: '/environments',
    component: Environemnt
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/regiter',
    component: Register
  }
]
