import { request, setToken } from './request'

export function login(code) {
  return request('/api/mp/login', { method: 'POST', data: { code } })
}

export function getArticles(params = {}) {
  return request('/api/public/articles', { data: params })
}

export function getArticleDetail(id) {
  return request('/api/public/articles/' + id)
}

export function getCategories() {
  return request('/api/public/categories')
}

export function getTags() {
  return request('/api/public/tags')
}

export function getComments(articleId) {
  return request('/api/mp/comments/' + articleId)
}

export function postComment(article_id, content) {
  return request('/api/mp/comments', { method: 'POST', data: { article_id, content } })
}

export function toggleLike(article_id) {
  return request('/api/mp/likes', { method: 'POST', data: { article_id } })
}

export function getLikeStatus(articleId) {
  return request('/api/mp/likes/status/' + articleId)
}

export function toggleBookmark(article_id) {
  return request('/api/mp/bookmarks', { method: 'POST', data: { article_id } })
}

export function getBookmarks(params = {}) {
  return request('/api/mp/bookmarks', { data: params })
}

export function updateProfile(data) {
  return request('/api/mp/profile', { method: 'POST', data })
}
