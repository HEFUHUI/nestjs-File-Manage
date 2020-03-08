import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser:{
      avatar:{
        url:"http://hefuhui-1258205592.cos.ap-guangzhou.myqcloud.com/files/8f172a08e99a8ef869cc044dcf5ae12d.png"
      }
    },
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
