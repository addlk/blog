<template>
  <div>
    <div class="page-header">
      <h1>[ 标签大全 ]</h1>
      <p style="font-size:13px;color:var(--color-text-dim);">按标签浏览相关文章</p>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="pixel-spinner"><div class="p1"></div><div class="p2"></div><div class="p3"></div><div class="p4"></div></div>
      <p>正在加载标签...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>加载失败</p>
      <button class="btn-pixel" @click="loadTags">重试</button>
    </div>

    <div v-else-if="!tags.length" class="empty-state">
      <p>暂无标签</p>
    </div>

    <div v-else class="tag-wrapper">
      <div class="tag-cloud">
        <router-link v-for="tag in tags" :key="tag.id" :to="'/tag/' + tag.id" class="tag-item" :style="{ fontSize: getTagSize(tag.articleCount) }">
          {{ tag.name }}
          <span class="tag-count">{{ tag.articleCount || 0 }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTags } from '@/api'

const tags = ref([])
const loading = ref(true)
const error = ref(false)

async function loadTags() {
  loading.value = true
  error.value = false
  try {
    tags.value = (await getTags()) || []
  } catch (e) {
    console.error('Failed to load tags:', e)
    error.value = true
  } finally { loading.value = false }
}

function getTagSize(count) {
  const base = 14
  const max = 24
  const ratio = Math.min((count || 1) / 10, 1)
  return Math.round(base + ratio * (max - base)) + 'px'
}

onMounted(loadTags)
</script>

<style scoped>
.tag-wrapper {
  background: var(--color-surface);
  padding: 24px;
  box-shadow: 4px 4px 0 0 var(--color-border);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--color-bg);
  color: var(--color-tag);
  text-decoration: none;
  box-shadow: 3px 3px 0 0 var(--color-border);
  transition: all 0.1s steps(3);
  line-height: 1.4;
}

.tag-item:hover {
  background: var(--color-surface-hover);
  box-shadow: 1px 1px 0 0 var(--color-tag);
  transform: translate(2px, 2px);
}

.tag-count {
  font-size: 0.75em;
  padding: 1px 6px;
  background: rgba(0,0,0,0.3);
  color: var(--color-text-dim);
}

.tag-item:hover .tag-count { background: rgba(0,0,0,0.5); }
</style>

