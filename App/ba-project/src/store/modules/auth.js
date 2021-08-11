import axios from 'axios'

const state = {
    user: null,
    projects: null,
};

const getters = {
    isAuthenticated: (state) => !!state.user,
    StateUser: (state) => state.user,
    StateProjects: (state) => state.projects,
};

const actions = {
    async Register({dispatch}, form) {
        await axios.post('register', form)
        let UserForm = new FormData()
        UserForm.append('username', form.username)
        UserForm.append('password', form.password)
        await dispatch('Login', UserForm)
    },
    async LogIn({commit}, user) {
        await axios.post('login', user)
        await commit('setUser', user.getters('username'))
    },
    async LogOut({commit}) {
        let user = null
        commit('logaout', user)
    },
    async GetProjects({commit}) {
        let response = await axios.get('projects');
        commit('setProjects', response.data);
    },
    async CreateProject({dispatch}, project) {
        await axios.post('project', project)
        await dispatch('GetProjects')
    }
};

const mutations = {
    setUser(state, username) {
        state.user = username
    },
    LogOut(state) {
        state.user = null
        state.projects = null
    },
    setProjects(state, projects) {
        state.projects = projects
    }
};
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};