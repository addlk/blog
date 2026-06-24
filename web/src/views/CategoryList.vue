<template>
  <div>
    <div class="page-header">
      <h1>[ 分类大全 ]</h1>
      <p style="font-size:13px;color:var(--color-text-dim);">按分类浏览所有文章</p>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="pixel-spinner"><div class="p1"></div><div class="p2"></div><div class="p3"></div><div class="p4"></div></div>
      <p>正在加载分类...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>加载失败</p>
      <button class="btn-pixel" @click="loadCategories">重试</button>
    </div>

    <div v-else-if="!categories.length" class="empty-state">
      <p>暂无分类</p>
    </div>

    <div v-else class="category-grid">
      <router-link v-for="cat in categories" :key="cat.id" :to="'/category/' + cat.id" class="category-card">
        <h3 class="category-name">{{ cat.name }}</h3>
        <p class="category-desc" v-if="cat.description">{{ cat.description }}</p>
        <span class="category-count">{{ cat.articleCount || 0 }} 篇文章</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCategories } from '@/api'

const categories = ref([])
const loading = ref(true)
const error = ref(false)

async function loadCategories() {
  loading.value = true
  error.value = false
  try {
    categories.value = (await getCategories()) || []
  } catch (e) {
    console.error('Failed to load categories:', e)
    error.value = true
  } finally { loading.value = false }
}

onMounted(loadCategories)
</script>

<style scoped>
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.category-card {
  background: var(--color-surface);
  padding: 20px;
  box-shadow: 4px 4px 0 0 var(--color-border);
  text-decoration: none;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  transition: all 0.1s steps(3);
}

.category-card:hover {
  background: var(--color-surface-hover);
  box-shadow: 2px 2px 0 0 var(--color-border);
  transform: translate(2px, 2px);
}

.category-name {
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--color-primary);
  text-shadow: 1px 1px 0 #2a2a5e;
  margin-bottom: 8px;
}

.category-desc {
  font-size: 12px;
  color: var(--color-text-dim);
  line-height: 1.5;
  margin-bottom: 8px;
}

.category-count {
  font-size: 11px;
  color: var(--color-text-dim);
  margin-top: auto;
  padding-top: 8px;
}
</style>

