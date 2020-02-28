import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser:{},
    options:{},
    token:'',
    JustUploadFile:{}
  },
  mutations: {
    login(state, {userInfo, options}){
      state.currentUser = userInfo;
      state.options = options;
    },
    token(state,token){
      state.token = token;
    },
    upload(state,fileInfo){
      state.JustUploadFile = fileInfo
    }
  },
  getters:{
    JustUploadFile(state){
      return state.JustUploadFile
    },
    token(state){
      return "Bearer "+(state.token !== "" ? state.token : sessionStorage.token)
    },
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
