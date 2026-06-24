import { getToken, setToken } from '../api/request'
import { login } from '../api/index'

export const userStore = {
  data() {
    return {
      token: getToken(),
      userInfo: null
    }
  },
  async autoLogin() {
    if (this.token) return true
    try {
      const res = await new Promise((resolve, reject) => {
        uni.login({
          success(r) { resolve(r.code) },
          fail() { reject(new Error('login fail')) }
        })
      })
      const data = await login(res)
      setToken(data.token)
      this.token = data.token
      this.userInfo = data.user
      return true
    } catch(e) {
      console.error('Auto login failed:', e)
      return false
    }
  }
}
