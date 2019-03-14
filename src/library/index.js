import axios from "axios";

const lib = {
  install: function(Vue) {
    let tyedu = {};
    Vue.prototype.$http = axios;
    window.tyedu = tyedu;
  }
};

export default lib;
