/**
 * 网络请求配置
 */
import axios from "axios";
import fetchAdapter from "@vespaiach/axios-fetch-adapter";

const service = axios.create({
  timeout: 10 * 1000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
  adapter: fetchAdapter,
});

// 链式拦截器, 处理个性化
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    return checkStatus(response);
  },
  (error) => {
    console.log("请求出错：", error);
  }
);

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300 && response.data) {
    return response;
  }
  return response.json().then((res) => {
    const errortext = res.message || response.statusText;
    console.error({
      message: `请求错误 ${response.status}`,
      description: `${errortext}`,
    });
  });
};

export default service;
