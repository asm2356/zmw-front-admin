import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import action from './action'

Vue.use(Vuex);
let state = {
  account: null,
  roles: null
};
export default new Vuex.Store({
  state,
  action,
  mutations
})
