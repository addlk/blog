import request from './request'
import { API_BASE } from './config.js'

// === Public APIs ===
export function getArticles(params = {}) {
  return request({ url: '/public/articles', method: 'get', params })
}

export function getArticleDetail(id) {
  return request({ url: `/public/articles/${id}`, method: 'get' })
}

export function getCategories() {
  return request({ url: '/public/categories', method: 'get' })
}

export function getTags() {
  return request({ url: '/public/tags', method: 'get' })
}

// === Auth APIs ===
export function login(data) {
  return request({ url: '/auth/login', method: 'post', data })
}

export function getProfile() {
  return request({ url: '/auth/profile', method: 'get' })
}

// === Admin: Articles ===
export function getAdminArticles(params = {}) {
  return request({ url: '/admin/articles', method: 'get', params })
}

export function getAdminArticle(id) {
  return request({ url: `/admin/articles/${id}`, method: 'get' })
}

export function createArticle(data) {
  return request({ url: '/admin/articles', method: 'post', data })
}

export function updateArticle(id, data) {
  return request({ url: `/admin/articles/${id}`, method: 'put', data })
}

export function deleteArticle(id) {
  return request({ url: `/admin/articles/${id}`, method: 'delete' })
}

// === Admin: Categories ===
export function getAdminCategories() {
  return request({ url: '/admin/categories', method: 'get' })
}

export function createCategory(data) {
  return request({ url: '/admin/categories', method: 'post', data })
}

export function updateCategory(id, data) {
  return request({ url: `/admin/categories/${id}`, method: 'put', data })
}

export function deleteCategory(id) {
  return request({ url: `/admin/categories/${id}`, method: 'delete' })
}

// === Admin: Tags ===
export function getAdminTags() {
  return request({ url: '/admin/tags', method: 'get' })
}

export function createTag(data) {
  return request({ url: '/admin/tags', method: 'post', data })
}

export function updateTag(id, data) {
  return request({ url: `/admin/tags/${id}`, method: 'put', data })
}

export function deleteTag(id) {
  return request({ url: `/admin/tags/${id}`, method: 'delete' })
}

// === Upload ===
export function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  return fetch(API_BASE + '/upload', {
    method: 'POST',
    body: formData
  }).then(res => res.json()).then(data => {
    if (data.code === 200) return data.data
    throw new Error(data.msg || '上传失败')
  })
}








