import axios from 'axios'

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error)
})

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
        // let UserForm = new FormData()
        // UserForm.append('username', form.username)
        // UserForm.append('password', form.password)
        await dispatch('LogIn', form)
    },
    async LogIn({commit}, user) {
        await axios.post('login', user)
        await commit('setUser', user.username)
    },
    async LogOut({commit}) {
        let user = null
        commit('logOut', user)
    },
    async GetProjects({commit}) {
        let response = await axios.get('projects');
        commit('setProjects', response.data);
    },
    async GetProject({commit}, id) {
        let response = await axios.get(`project/${id}`);
        commit('setProject', response.data);
    },
    async GetUser({commit}, username) {
        let response = await axios.get(`user/${username}`);
        commit('setUser', response.data);
    },
    async CreateProject({dispatch}, project) {
        await axios.post('project', project)
        await dispatch('GetProjects')
    },
    async UpdateProject({dispatch}, project) {
        await axios.put(`project/${project._id}`, project)
        await dispatch('GetProject', project.id)
    },
    async RemoveProject({dispatch}, _id) {
        await axios.delete(`project/${_id}`)
        await dispatch('GetProject')
    },
};

const mutations = {
    setUser(state, username) {
        state.user = username
    },
    logOut(state) {
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