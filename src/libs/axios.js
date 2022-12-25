import Vue from "vue";
import axios from "axios";

import store from '@state/store'
import appConstants from "@common/constants/appConstants";

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  withCredentials: false,
  baseURL: `${appConstants.apiBaseUrl}/api`,
  // timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    common: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});

// Request Interceptor
axiosIns.interceptors.request.use(
  (config) => {
    // // Get token from localStorage
    // const token = store.getters['auth/loggedIn'] ? store.getters['auth/token'] : false;

    // // If token is present add it to request's Authorization Header
    // if (store.getters['auth/loggedIn']) {
    //   config.headers.Authorization = `${appConstants.tokenType} ${accessToken}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosIns.interceptors.response.use(
  (response) => {
    // console.log('axiosIns.interceptors.response response', response);
    if (response.config.parse) {
      // perform the manipulation here and change the response object
    }
    return response;
  },
  (error) => {
    // console.log('axiosIns.interceptors.response error', error);
    const vm = new Vue()
    const { config, response } = error
    const originalRequest = config

    if (response && response.status === 401) {
      // do refresh token

      return Promise.reject(error);
    } else {
      console.log('axiosIns error', error.response.data);
      const { message, err } = error.response.data
      if (!error.response) {
        vm.$events.fire('showNotif', { msg: 'Error: Network Error', variant: 'error' })
      } else if (message !== undefined) {
        vm.$events.fire('showNotif', { msg: message, variant: 'error' })
      } else if (err !== undefined) {
        vm.$events.fire('showNotif', { msg: err, variant: 'error' })
      } else if (response) {
        const { data } = response.data
        vm.$events.fire('showNotif', { msg: data.message, variant: 'error' })
      } else {
        vm.$events.fire('showNotif', { msg: error.response.statusText, variant: 'error' })
      }

      return Promise.reject(error);
    }
  }
);

Vue.prototype.$http = axiosIns;

export default axiosIns;
