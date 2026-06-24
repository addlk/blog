<template>
  <div class="sidebar-inner">
    <div class="widget" v-if="categories.length">
      <h3 class="widget-title">[ CATEGORIES ]</h3>
      <ul class="category-list">
        <li v-for="cat in categories" :key="cat.id">
          <router-link :to="'/category/' + cat.id" class="category-item" active-class="active">
            <span class="cat-name">{{ cat.name }}</span>
            <span class="cat-count">{{ cat.articleCount || 0 }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="widget" v-if="tags.length">
      <h3 class="widget-title">[ TAGS ]</h3>
      <div class="tag-cloud">
        <router-link v-for="tag in tags" :key="tag.id" :to="'/tag/' + tag.id" class="tag-item">
          {{ tag.name }}
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="widget loading-widget">
      <div class="pixel-spinner"><div class="p1"></div><div class="p2"></div><div class="p3"></div><div class="p4"></div></div>
      <p>LOADING...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCategories, getTags } from '@/api'

const categories = ref([])
const tags = ref([])
const loading = ref(true)

async function fetchData() {
  loading.value = true
  try {
    const [catRes, tagRes] = await Promise.all([getCategories(), getTags()])
    categories.value = catRes || []
    tags.value = tagRes || []
  } catch (e) { console.error('Sidebar data load failed:', e) }
  finally { loading.value = false }
}

onMounted(fetchData)
</script>

<style scoped>
.sidebar-inner {
  position: sticky;
  top: calc(var(--header-height) + 24px);
}

.widget {
  background: var(--color-surface);
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 4px 4px 0 0 var(--color-border);
}

.widget-title {
  font-family: var(--font-display);
  font-size: 11px;
  color: var(--color-accent);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 3px solid var(--color-border);
}

.category-list li { margin-bottom: 2px; }

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  color: var(--color-text-dim);
  font-size: 13px;
  text-decoration: none;
  box-shadow: 3px 3px 0 0 var(--color-border);
  margin-bottom: 4px;
  transition: all 0.1s steps(3);
}

.category-item:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
  box-shadow: 1px 1px 0 0 var(--color-border);
  transform: translate(2px, 2px);
}

.category-item.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  box-shadow: 1px 1px 0 0 var(--color-primary);
}

.cat-count {
  padding: 1px 8px;
  background: var(--color-bg);
  font-size: 11px;
  color: var(--color-text-dim);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-item {
  display: inline-block;
  padding: 4px 10px;
  background: var(--color-bg);
  color: var(--color-tag);
  font-size: 11px;
  text-decoration: none;
  box-shadow: 2px 2px 0 0 var(--color-border);
  transition: all 0.1s steps(3);
}

.tag-item:hover {
  background: var(--color-surface-hover);
  box-shadow: 1px 1px 0 0 var(--color-tag);
  color: var(--color-tag);
  transform: translate(1px, 1px);
}

.loading-widget { text-align: center; color: var(--color-text-dim); font-size: 12px; }
.loading-widget .pixel-spinner { width: 32px; height: 32px; margin: 0 auto 8px; }
.loading-widget .pixel-spinner div { width: 12px; height: 12px; }
</style>
