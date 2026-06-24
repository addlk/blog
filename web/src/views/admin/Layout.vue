<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <router-link to="/admin" class="sidebar-logo">
          <div class="logo-avatar">
            <div class="la"></div><div class="la la-a"></div><div class="la la-a"></div><div class="la la-a"></div><div class="la"></div>
            <div class="la la-a"></div><div class="la"></div><div class="la"></div><div class="la"></div><div class="la la-a"></div>
            <div class="la la-a"></div><div class="la"></div><div class="la la-g"></div><div class="la la-g"></div><div class="la la-a"></div>
            <div class="la la-a"></div><div class="la"></div><div class="la"></div><div class="la"></div><div class="la la-a"></div>
            <div class="la"></div><div class="la la-a"></div><div class="la la-a"></div><div class="la la-a"></div><div class="la"></div>
          </div>
          <span class="logo-text">管理后台</span>
        </router-link>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/admin" class="nav-item" :class="{ active: $route.path === '/admin' }">
          <span>[仪表盘]</span>
        </router-link>
        <router-link to="/admin/articles" class="nav-item" :class="{ active: $route.path.startsWith('/admin/articles') }">
          <span>[文章]</span>
        </router-link>
        <router-link to="/admin/categories" class="nav-item" :class="{ active: $route.path === '/admin/categories' }">
          <span>[分类]</span>
        </router-link>
        <router-link to="/admin/tags" class="nav-item" :class="{ active: $route.path === '/admin/tags' }">
          <span>[标签]</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <div class="user-info">
          <span class="user-avatar">{{ userInitial }}</span>
          <span class="user-name">{{ nickname }}</span>
        </div>
        <button class="logout-btn" @click="handleLogout">[退出]</button>
        <router-link to="/" class="back-link">[查看前台]</router-link>
      </div>
    </aside>
    <main class="admin-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser, removeToken } from '@/utils/auth'

const router = useRouter()
const user = getCurrentUser()
const nickname = computed(() => user?.nickname || user?.username || 'ADMIN')
const userInitial = computed(() => nickname.value.charAt(0).toUpperCase())

function handleLogout() { removeToken(); router.push('/admin/login') }
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; background: var(--color-bg); }

.admin-sidebar {
  width: 200px;
  background: var(--color-surface);
  display: flex;
  flex-direction: column;
  position: fixed; top: 0; left: 0; bottom: 0;
  z-index: 100;
  border-right: 4px solid var(--color-border);
}

.sidebar-header { padding: 20px; border-bottom: 4px solid var(--color-border); }

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.logo-avatar {
  width: 30px; height: 30px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 1px;
  image-rendering: pixelated;
  flex-shrink: 0;
}

.la { width: 5px; height: 5px; background: transparent; }
.la.la-a { background: var(--color-primary); }
.la.la-g { background: var(--color-secondary); }

.logo-text {
  font-family: var(--font-display);
  font-size: 12px;
  color: var(--color-primary);
  text-shadow: 1px 1px 0 #2a2a5e;
}

.sidebar-nav { flex: 1; padding: 12px; display: flex; flex-direction: column; gap: 4px; }

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  color: var(--color-text-dim);
  font-size: 12px;
  text-decoration: none;
  box-shadow: 3px 3px 0 0 var(--color-border);
  transition: all 0.1s steps(3);
}

.nav-item:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
  box-shadow: 1px 1px 0 0 var(--color-border);
  transform: translate(2px, 2px);
}

.nav-item.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  box-shadow: 1px 1px 0 0 var(--color-primary);
}

.sidebar-footer {
  padding: 16px;
  border-top: 4px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-info { display: flex; align-items: center; gap: 8px; }

.user-avatar {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  background: var(--color-primary);
  color: var(--color-bg);
  font-size: 12px;
  box-shadow: 2px 2px 0 0 var(--color-border);
}

.user-name { font-size: 12px; color: var(--color-text); }

.logout-btn, .back-link {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px;
  color: var(--color-text-dim);
  font-size: 11px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.1s steps(3);
}

.logout-btn:hover, .back-link:hover { color: var(--color-primary); background: var(--color-primary-light); }

.admin-main { margin-left: 200px; flex: 1; padding: 24px; min-height: 100vh; }
</style>

