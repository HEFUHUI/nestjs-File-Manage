"use strict";

import Vue from 'vue';
import axios from "axios";
import {Message,Notification,Loading} from "element-ui"

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let loading;
function startloading(){
  loading = Loading.service({
    fullscreen:true,
    text:"玩命加载中...."
  })
}

function endloading(){
  loading.close();
}

let config = {
  baseURL: process.env.baseURL || process.env.apiUrl || "http://localhost:3009",
  timeout: 60 * 1000, // Timeout
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    if (sessionStorage.token) {
      config.headers.Authorization = 'Bearer ' + sessionStorage.token
    }
    startloading();
    return config;
  },
  function(error) {
    Notification({message:error.message,title:"请求错误."})
    return Promise.reject(error);
  }
);

_axios.interceptors.response.use(
  function(response) {
    endloading();
    if(response.status===202){
      Message({type:"success",message:response.data.message||"操作完成"})
    }
    return response;
  },
  function(error) {
    endloading();
    if(error.response.status===401)Message({message:error.response.data.message||"权限错误.",type:'error'})
    if(error.response.status===500)Notification({message:error.response.data.message||error.message.data.error||"请稍后再试.",title:"服务器错误"})
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue, options) {
  console.log(options);
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
