import axios from 'axios'
import store from '@/store'
import { router } from '../helpers'

export const api = axios.create({
  baseURL: '/api/',
  timeout: 20000
});

api.interceptors.request.use((config) => {
  config.headers['x-access-token'] = `${store.state.common.access_token}`;
  return config;
}, (error) => {
  return Promise.reject(error);
})

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401 ) {
      if (router.currentRoute.path !== '/login') {
        store.dispatch('common/logout', true);
      }
    }

    return Promise.reject({ ...error });
  }
);