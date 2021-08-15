import axios from 'axios'

const state = {
    user: null,
    projects: null,
    project: null,
};

const getters = {
    isAuthenticated: (state) => !!state.user,
    StateUser: (state) => state.user,
    StateProjects: (state) => state.projects,
    StateProject: (state) => state.project,
};

const actions = {
    async Register({dispatch}, form) {
        await axios.post('register', form)
        let UserForm = new FormData()
        UserForm.append('username', form.username)
        UserForm.append('password', form.password)
        await dispatch('LogIn', UserForm)
    },
    async LogIn({commit}, user) {
        await axios.post('login', user)
        await commit('setUser', user.get('username'))
    },
    async LogOut({commit}) {
        let user = null
        commit('logout', user)
    },
    async GetProjects({commit}) {
        let response = await axios.get('projects');
        commit('setProjects', response.data);
    },
    async GetProject({commit}, id) {
        let response = await axios.get(`project/${id}`);
        commit('setProject', response.data);
    },
    async CreateProject({dispatch}, project) {
        await axios.post('project', project)
        await dispatch('GetProjects')
    },
    async UpdateProject({dispatch}, project) {
        await axios.put(`project/${project._id}`, project)
        await dispatch('GetProject')
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
    },
    setProject(state, project) {
        state.project = project
    },
};
export default {
    state,
    getters,
    actions,
    mutations,
};