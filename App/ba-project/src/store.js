/* eslint-disable no-param-reassign */
import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from 'vuex-persistedstate';
import auth from './store/modules/auth.js';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
  },
  pugins: [createPersistedState()],
  // state: {
  //   userName: undefined,
  //   userId: undefined,
  //   userEmail: undefined
  // },
  // getters: {
  //   userName: (state) => state.userName,
  //   userId: (state) => state.userId,
  //   userEmail: (state) => state.userEmail
  // },
  // mutations: {
  //   setUserName: (state, str) => {
  //     state.userName = str
  //   },
  //   setUserId: (state, str) => {
  //     state.userId = str
  //   },
  //   setUserEmail: (state, str) => {
  //     state.userEmail = str
  //   }
  // },
  // actions: {}
})
