const API_BASE = 'http://localhost:8080'
const TOKEN_KEY = 'mp_token'

export function getToken() {
  try { return uni.getStorageSync(TOKEN_KEY) } catch(e) { return '' }
}

export function setToken(t) {
  uni.setStorageSync(TOKEN_KEY, t)
}

export async function request(path, options = {}) {
  const token = getToken()
  const header = { 'Content-Type': 'application/json', ...options.header }
  if (token) header['Authorization'] = 'Bearer ' + token

  return new Promise((resolve, reject) => {
    uni.request({
      url: API_BASE + path,
      method: options.method || 'GET',
      data: options.data,
      header,
      success(res) {
        const data = res.data
        if (data.code === 200) resolve(data.data)
        else reject(new Error(data.msg || '请求失败'))
      },
      fail(err) { reject(new Error('网络错误')) }
    })
  })
}
