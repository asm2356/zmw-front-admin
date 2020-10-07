import router from '../router'
import {LOGIN, LOGIN_OUT, USER_ROLES} from "./mutations-types";
import store from "./index";
import myUtils from "../utils/myUtils";

export default {
  [LOGIN](state, account) {
    myUtils.setStore("account", account);
    state.account = account
  },
  [LOGIN_OUT](state) {
    myUtils.removeStore("account");
    myUtils.removeStore("roles");
    state.account = null;
    state.roles = null;
  },
  [USER_ROLES](state, roles) {
    myUtils.setStore("roles", roles);
    state.roles = roles;
  }
}
router.beforeEach((to, from, next) => {
  store.state.account = myUtils.getStore('account');
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (store.state.account != null) {
      next();
    } else {
      next({
        name: 'login'
      })
    }
  }
  else {
    next();
  }
});
router.afterEach(route => {
  //加载完成
});


