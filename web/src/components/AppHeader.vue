<template>
  <header class="site-header">
    <div class="header-inner page-container">
      <router-link to="/" class="logo">
        <div class="pixel-avatar">
          <div class="px"></div><div class="px"></div><div class="px p-amber"></div><div class="px p-amber"></div><div class="px p-amber"></div><div class="px"></div><div class="px"></div><div class="px"></div>
          <div class="px"></div><div class="px p-amber"></div><div class="px"></div><div class="px p-amber"></div><div class="px"></div><div class="px p-amber"></div><div class="px"></div><div class="px"></div>
          <div class="px p-amber"></div><div class="px"></div><div class="px p-amber"></div><div class="px p-amber"></div><div class="px p-amber"></div><div class="px"></div><div class="px p-amber"></div><div class="px"></div>
          <div class="px p-amber"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px p-amber"></div><div class="px"></div>
          <div class="px p-amber"></div><div class="px"></div><div class="px p-cyan"></div><div class="px p-cyan"></div><div class="px p-cyan"></div><div class="px"></div><div class="px p-amber"></div><div class="px"></div>
          <div class="px p-amber"></div><div class="px"></div><div class="px"></div><div class="px p-cyan"></div><div class="px"></div><div class="px"></div><div class="px p-amber"></div><div class="px"></div>
          <div class="px"></div><div class="px p-amber"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px p-amber"></div><div class="px"></div><div class="px"></div>
          <div class="px"></div><div class="px"></div><div class="px p-amber"></div><div class="px p-amber"></div><div class="px p-amber"></div><div class="px"></div><div class="px"></div><div class="px"></div>
        </div>
        <span class="logo-text">像素小站</span>
      </router-link>
      <nav class="main-nav">
        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">[首页]</router-link>
        <router-link to="/categories" class="nav-link" :class="{ active: $route.path.startsWith('/categories') || $route.path.startsWith('/category') }">[分类]</router-link>
        <router-link to="/tags" class="nav-link" :class="{ active: $route.path.startsWith('/tags') || $route.path.startsWith('/tag') }">[标签]</router-link>
        <router-link to="/admin/login" class="nav-link admin-link">[管理]</router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  height: var(--header-height);
  background: var(--color-surface);
  border-bottom: 4px solid var(--color-border);
}

.header-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  cursor: pointer;
}

.pixel-avatar {
  width: 40px; height: 40px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 1px;
  image-rendering: pixelated;
  flex-shrink: 0;
}

.px { width: 4px; height: 4px; background: transparent; }
.px.p-amber { background: var(--color-primary); }
.px.p-cyan { background: var(--color-tag); }

.logo-text {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--color-primary);
  text-shadow: 2px 2px 0 #2a2a5e;
}

.main-nav { display: flex; align-items: center; gap: 4px; }

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 13px;
  font-weight: 400;
  text-decoration: none;
  box-shadow: 3px 3px 0 0 var(--color-border);
  transition: all 0.1s steps(3);
}

.nav-link:hover {
  background: var(--color-surface-hover);
  box-shadow: 1px 1px 0 0 var(--color-border);
  transform: translate(2px, 2px);
}

.nav-link.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  box-shadow: 1px 1px 0 0 var(--color-primary);
}

.admin-link { opacity: 0.6; font-size: 11px; }
.admin-link:hover { opacity: 1; }

@media (max-width: 768px) {
  .logo-text { font-size: 13px; }
  .nav-link { padding: 6px 10px; font-size: 11px; }
}
</style>

