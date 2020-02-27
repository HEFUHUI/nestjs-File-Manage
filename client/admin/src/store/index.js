import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser:{},
    options:{}
  },
  mutations: {
    login(state, {userInfo, options}){
      state.currentUser = userInfo;
      state.options = options;
    }
  },
  getters:{
    userInfo (state) {
      return state.currentUser;
    },
    options(state) {
      return state.options;
    } 
  },
  actions: {
  },
  modules: {
  }
})
