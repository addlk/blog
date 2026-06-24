<template>
  <footer class="site-footer">
    <div class="footer-inner page-container">
      <div class="footer-nav">
        <router-link to="/">[首页]</router-link>
        <router-link to="/categories">[分类]</router-link>
        <router-link to="/tags">[标签]</router-link>
        <router-link to="/admin/login">[管理]</router-link>
      </div>
      <div class="footer-meta">
        <p>使用 <span class="heart">❤</span> Vue 3 构建</p>
        <p class="copyright">&copy; {{ year }} 像素小站</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  margin-top: auto;
  background: var(--color-surface);
  border-top: 4px solid var(--color-border);
  padding: 32px 0 24px;
}

.footer-nav {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.footer-nav a {
  color: var(--color-text-dim);
  font-size: 13px;
  text-decoration: none;
  padding: 4px 8px;
  transition: all 0.1s steps(3);
}

.footer-nav a:hover {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.footer-meta {
  text-align: center;
  font-size: 11px;
  color: var(--color-text-dim);
}

.footer-meta p { margin-bottom: 4px; }

.heart { color: var(--color-accent); }
</style>

