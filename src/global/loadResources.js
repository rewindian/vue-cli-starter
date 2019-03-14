export default function asyncLoadJs(url) {
  return new Promise((resolve, reject) => {
    const srcArr = document.getElementsByTagName("script");
    let hasLoaded = false;
    for (let i = 0; i < srcArr.length; i++) {
      // 判断当前js是否加载上
      hasLoaded = srcArr[i].src === url;
    }
    if (hasLoaded) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.body.appendChild(script);
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject();
    };
  });
}

export function loadCss(url) {
  const css = document.createElement("link");
  css.href = url;
  css.rel = "stylesheet";
  css.type = "text/css";
  document.head.appendChild(css);
}
//加载远程css和js
export function loadRemoteJs() {
  const appDomainRoot = window.tyedu.cfg.appDomainRoot;
  // 加载css
  loadCss(appDomainRoot + "/css/weui.min.css");
  loadCss(appDomainRoot + "/zujian_v3/css/jquery-weui.min.css");
  loadCss(appDomainRoot + "/flowApprove/css/flowApprove.css");
  loadCss(appDomainRoot + "/css/zujian_v3.css");

  // 加载js
  return new Promise((resolve, reject) => {
    asyncLoadJs(appDomainRoot + "/js/jquery.js")
      .then(() => {
        return asyncLoadJs(appDomainRoot + "/zujian_v3/js/jquery-weui.min.js");
      })
      .then(() => {
        return asyncLoadJs(appDomainRoot + "/js/weui.min.js");
      })
      .then(() => {
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });
}
