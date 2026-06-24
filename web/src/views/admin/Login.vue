<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="login-avatar">
          <div class="lap"></div><div class="lap"></div><div class="lap lap-a"></div><div class="lap lap-a"></div><div class="lap lap-a"></div><div class="lap"></div><div class="lap"></div>
          <div class="lap"></div><div class="lap lap-a"></div><div class="lap"></div><div class="lap"></div><div class="lap"></div><div class="lap lap-a"></div><div class="lap"></div>
          <div class="lap lap-a"></div><div class="lap"></div><div class="lap lap-g"></div><div class="lap lap-g"></div><div class="lap"></div><div class="lap lap-a"></div><div class="lap"></div>
          <div class="lap lap-a"></div><div class="lap"></div><div class="lap"></div><div class="lap"></div><div class="lap"></div><div class="lap"></div><div class="lap lap-a"></div>
          <div class="lap"></div><div class="lap lap-a"></div><div class="lap lap-a"></div><div class="lap lap-a"></div><div class="lap lap-a"></div><div class="lap lap-a"></div><div class="lap"></div>
        </div>
        <h1>管理员登录</h1>
        <p style="font-size:11px;color:var(--color-text-dim);">请输入用户名和密码</p>
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>用户名</label>
          <input v-model="form.用户名" type="text" placeholder="admin" required />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input v-model="form.密码" type="密码" placeholder="******" required />
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? '登录中...' : '[ 登录 ]' }}
        </button>
      </form>
      <router-link to="/" class="back-link">[返回首页]</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api'
import { setToken } from '@/utils/auth'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const form = reactive({ 用户名: '', 密码: '' })

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const data = await login(form)
    setToken(data.token)
    router.push('/admin')
  } catch (err) {
    error.value = err.message || '登录失败'
  } finally { loading.value = false }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 20px;
}

.login-card {
  width: 380px;
  max-width: 100%;
  background: var(--color-surface);
  padding: 32px;
  box-shadow: 8px 8px 0 0 var(--color-border);
}

.login-header { text-align: center; margin-bottom: 28px; }

.login-avatar {
  width: 56px;
  height: 40px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 1px;
  margin: 0 auto 16px;
  image-rendering: pixelated;
}
.lap { width: 7px; height: 7px; background: transparent; }
.lap.lap-a { background: var(--color-primary); }
.lap.lap-g { background: var(--color-secondary); }

.login-header h1 {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--color-primary);
  text-shadow: 2px 2px 0 #2a2a5e;
  margin-bottom: 6px;
}

.form-group { margin-bottom: 16px; }

.form-group label {
  display: block;
  font-size: 11px;
  color: var(--color-text-dim);
  margin-bottom: 6px;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  background: var(--color-bg);
  border: none;
  color: var(--color-text);
  box-shadow: inset 3px 3px 0 0 var(--color-border);
  outline: none;
  box-sizing: border-box;
}

.form-group input:focus { box-shadow: inset 3px 3px 0 0 var(--color-primary); }

.error-msg { color: var(--color-danger); font-size: 12px; margin-bottom: 12px; }

.login-btn {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  background: var(--color-primary);
  color: var(--color-bg);
  box-shadow: 4px 4px 0 0 #2a2a5e;
  font-family: var(--font-mono);
  transition: all 0.1s steps(3);
}

.login-btn:hover {
  box-shadow: 2px 2px 0 0 #2a2a5e;
  transform: translate(2px, 2px);
}

.login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.login-btn:disabled:hover { box-shadow: 4px 4px 0 0 #2a2a5e; transform: none; }

.back-link { display: block; text-align: center; margin-top: 20px; color: var(--color-text-dim); font-size: 12px; text-decoration: none; }
.back-link:hover { color: var(--color-primary); }
</style>

