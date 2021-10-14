import axios from 'axios'

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error)
})

const state = {
    user: null,
    fullUser: null,
    projects: null,
    project: null,
};

const getters = {
    isAuthenticated: (state) => !!state.user,
    StateUser: (state) => state.user,
    StateFullUser: (state) => state.fullUser,
    StateProjects: (state) => state.projects,
    StateProject: (state) => state.project,
};

const actions = {
    async Register({dispatch}, form) {
        await axios.post('register', form)
        await dispatch('LogIn', form)
    },
    async LogIn({commit}, user) {
        let res = await axios.post('login', user)
        if(res.status === 404)
            throw Error
        await commit('setUser', user.username)
    },
    async LogOut({commit}) {
        let user = null
        commit('logOut', user)
    },
    async GetProjects({commit}, username) {
        let response = await axios.get(`projects/${username}`);
        commit('setProjects', response.data);
    },
    async GetProject({commit}, id) {
        let response = await axios.get(`project/${id}`);
        commit('setProject', response.data);
    },
    async GetUser({commit}, username) {
        let response = await axios.get(`user/${username}`);
        commit('setFullUser', response.data);
    },
    async CreateProject({dispatch}, project) {
        await axios.post('project', project)
        await dispatch('GetProjects', project.username)
    },
    async UpdateProject({dispatch}, project) {
        await axios.put(`project/${project._id}`, project)
        await dispatch('GetProject', project._id)
    },
    async UpdateUser({dispatch}, user) {
        let res = await axios.put(`user/${user.username}`, user)
        if(res.status === 404)
            throw Error
        await dispatch('setFullUser', res.data)
    },
    async DeleteUser({commit}, userid) {
        console.log(userid)
        await axios.delete(`user/${userid}`)
        await commit('logOut', null)
    },
    async RemoveProject({dispatch}, project) {
        await axios.delete(`project/${project._id}`)
        await dispatch('GetProjects', project.user)
    },
};

const mutations = {
    setUser(state, username) {
        state.user = username
    },
    setFullUser(state, user) {
        state.fullUser = user
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