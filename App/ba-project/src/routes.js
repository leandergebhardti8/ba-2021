import User from './components/user/User.vue'
import Home from './components/Home.vue'
import Projects from './components/projects/Projects.vue'
import ProjectView from './components/projects/ProjectView.vue'
import Environemnt from './components/Environment.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'

export const routes = [
  {
    name: 'home',
    path: '',
    component: Home
  },
  {
    path: '/user/:id',
    component: User
  },
  {
    path: '/projects',
    component: Projects
  },
  {
    path: '/environment/:environmentId',
    component: Environemnt
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/regiter',
    component: Register
  },
  {
    path: '/project/:projectId',
    component: ProjectView
  }
]
