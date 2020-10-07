import Vue from "vue";
import myUtils from "../utils/myUtils";
import myGlobal from "../utils/myGlobal";
import MyHeader from "../components/myHeader";
import echarts from "echarts";
Vue.component("MyHeader", MyHeader);
Vue.filter("timestampToTime", (value) => {
  return myUtils.timestampToTime(value);
});
Vue.filter("timestampToSimpleTime", (value) => {
  return myUtils.timestampToSimpleTime(value);
});
/**
 * 字符串省略 ag. strkkkk=>str...
 * @param value 要省略的字符串
 * @param length 长度多少要省略
 */
Vue.filter("strOmit", (value, length) => {
  if (value == null) {
    return null;
  }
  if (value.length <= length) {
    return value;
  } else {
    return value.substring(0, length) + "...";
  }
});
Vue.prototype.echarts = echarts;
Vue.prototype.myGlobal = myGlobal;
Vue.prototype.myUtils = myUtils;

