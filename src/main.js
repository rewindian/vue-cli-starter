import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import library from "./library";
import axios from "axios";

Vue.use(library);
Vue.config.productionTip = false;

const initCfg = () => {
  const publicPath = process.env.publicPath;
  const configFilePath = `${publicPath}config/config.json?t=${new Date()}`;
  return axios
    .create()
    .get(configFilePath)
    .then(res => {
      window.tyedu.cfg = res.data;
    });
};

const initApp = () => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
};

initCfg().then(() => {
  initApp();
});
