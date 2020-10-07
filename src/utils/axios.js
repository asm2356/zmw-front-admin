import Vue from "vue";
import axios from "axios";
import {LoadingBar, Message} from "iview";
import router from '../router';
Vue.prototype.$ajax = axios;
//axios.defaults.baseURL = "http://127.0.0.1:8081";
axios.defaults.headers = {
  "Content-Type": "application/json;charset=UTF-8"
}
axios.defaults.withCredentials = true;

axios.interceptors.request.use(function (config) {
  LoadingBar.start();
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
axios.interceptors.response.use((response) => {
  LoadingBar.finish();
  let headers = response.headers;
  if (headers['content-type'] === "application/json;charset=UTF-8") {
    let data = response.data;
    if (data.code != 1) {
      if (data.code == 10010) {
        window.vm.$store.commit("LOGIN_OUT")
        router.push({
          name: 'login'
        });
      }
      else {
        Message.error(data.message)
      }
    }
  }

  return response;
}, (error) => {
  console.log(error);
  return Promise.reject(error);
});
