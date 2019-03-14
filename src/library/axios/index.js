import Axios from "axios";
import download from "./download";
import retry from "./retry";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

// 记录 xhr 请求次数
let ajaxCount = 0;

// NProgress.configure({ showSpinner: false })

// 定义 http request 拦截器
Axios.interceptors.request.use(
  function(request) {
    ajaxCount = ajaxCount + 1;

    NProgress.start();

    // 配置默认条件
    request.headers["Content-Type"] = "application/json;charset=UTF-8";
    request.timeout = Window.tyedu.cfg.axios.timeout || 0;
    request.retry = Window.tyedu.cfg.axios.retry || 0;
    request.retryDelay = Window.tyedu.cfg.axios.retryDelay || 1000;

    // 基于 mock , 直接发送请求
    if (request.url.indexOf("http://mock.eolinker.com/") !== -1) {
      return request;
    }

    // 其他请求，验证 token
    else {
      if (kindo.cache.get("USER_TOKEN")) {
        request.headers.Token = kindo.cache.get("USER_TOKEN");
      }

      return request;
    }
  },

  function(error) {
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  function(response) {
    ajaxCount = ajaxCount - 1;

    if (ajaxCount === 0) {
      NProgress.done(false);
    }

    // 基于 mock , 直接返回数据
    if (response.config.url.indexOf("http://mock.eolinker.com/") !== -1) {
      return response.data;
    }

    // 基于 downloadFile ，直接返回成功请求，由 download.js 自行处理
    else if (response.config.isDownload) {
      return response;
    }

    // 成功处理
    else if (response.status === 200) {
      // 正常请求，并且逻辑验证成功
      if (response.data && parseInt(response.data.code) === 200) {
        return response.data;
      }
      // 特殊提醒
      if (response.data && parseInt(response.data.code) === 999) {
        kindo.util.error(response.data.data);

        return Promise.reject(response);
      }
      // 逻辑验证失败
      else {
        kindo.util.error(response.data.message);

        return Promise.reject(response);
      }
    }

    // 其他返回状态码处理
    // TODO : 其他状态码的处理
    else {
      throw new Error("");
    }
  },

  function(error) {
    ajaxCount = ajaxCount - 1;

    if (ajaxCount === 0) {
      NProgress.done(false);
    }

    // 超时处理
    if (error.code === "ECONNABORTED") {
      if (!error.config.__isRetryComplete) {
        return retry(error);
      } else {
        kindo.util.error("请求超时");

        return Promise.reject(error);
      }
    }

    // 未知处理
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 401:
          // 移除所有 cache (session or local)
          kindo.cache.clear();

          // 安全性提示
          kindo.util.warning("鉴权失败，即将跳转登录...");

          // 动画遮罩
          setTimeout(() => {
            document.body.style.opacity = "1";
            document.body.style.transition = "all 2s";
            document.body.style.opacity = "0";
          }, 2000);

          setTimeout(() => {
            // 记录被拦截的路由地址, 登录成功后, 进行重定向
            kindo.referrer = kindo.$route.path;

            kindo.$router.push("/login");

            document.body.style.opacity = "1";
          }, 4000);
          break;

        default:
          kindo.util.error(error.message || "未知错误");
          break;
      }
    } else {
      kindo.util.error(error.message || "未知错误");
    }

    return Promise.reject(error);
  }
);

Axios.download = download;

export default Axios;
