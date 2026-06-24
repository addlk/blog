import axios from 'axios'
import { getToken, removeToken } from '../utils/auth.js'
import { API_BASE } from './config.js'

const request = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

request.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 200) {
      return res.data
    }
    if (res.code === 401) {
      removeToken()
      if (window.location.hash !== '#/admin/login' && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    console.error('API Error:', res.msg || '请求失败')
    return Promise.reject(new Error(res.msg || '请求失败'))
  },
  error => {
    console.error('Request Error:', error.message)
    return Promise.reject(error)
  }
)

export default request
