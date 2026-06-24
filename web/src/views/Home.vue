<template>
  <div>
    <div class="hero">
      <h1 class="glitch-hover">分享技术 · 记录思考<span class="cursor"></span></h1>
      <p class="subtitle">> A PERSONAL TECH BLOG</p>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="pixel-spinner"><div class="p1"></div><div class="p2"></div><div class="p3"></div><div class="p4"></div></div>
      <p>正在加载文章...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>文章加载失败</p>
      <button class="btn-pixel" @click="loadArticles">重试</button>
    </div>

    <div v-else-if="!articles.length" class="empty-state">
      <p>暂无已发布的文章</p>
      <p style="margin-top:8px;font-size:12px;">晚点再来看看吧</p>
    </div>

    <template v-else>
      <ArticleCard v-for="(article, idx) in articles" :key="article.id" :article="article" :delay="idx * 0.1" />

      <div class="pagination" v-if="totalPages > 1">
        <button class="btn-page" :disabled="currentPage <= 1" @click="goPage(currentPage - 1)">[上一页]</button>
        <button v-for="p in visiblePages" :key="p" class="btn-page" :class="{ active: p === currentPage }" @click="goPage(p)">{{ p }}</button>
        <button class="btn-page" :disabled="currentPage >= totalPages" @click="goPage(currentPage + 1)">[下一页]</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getArticles } from '@/api'
import ArticleCard from '@/components/ArticleCard.vue'

const articles = ref([])
const loading = ref(true)
const error = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 10

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)
  if (end - start < 4) {
    if (start === 1) end = Math.min(total, start + 4)
    else start = Math.max(1, end - 4)
  }
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

async function loadArticles() {
  loading.value = true
  error.value = false
  try {
    const res = await getArticles({ page: currentPage.value, pageSize })
    if (res && res.records) {
      articles.value = res.records
      totalPages.value = res.pages || Math.ceil(res.total / pageSize) || 1
    } else {
      articles.value = []
      totalPages.value = 1
    }
  } catch (e) {
    console.error('Failed to load articles:', e)
    error.value = true
  } finally { loading.value = false }
}

function goPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
  loadArticles()
}

onMounted(loadArticles)
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 48px 16px 32px;
  margin-bottom: 32px;
  background: var(--color-surface);
  box-shadow: 4px 4px 0 0 var(--color-border);
}

.hero h1 {
  font-family: var(--font-display);
  font-size: 22px;
  color: var(--color-primary);
  text-shadow: 3px 3px 0 #2a2a5e;
  line-height: 1.6;
  margin-bottom: 12px;
}

.cursor {
  display: inline-block;
  width: 12px;
  height: 22px;
  background: var(--color-primary);
  animation: blink 0.8s step-end infinite;
  vertical-align: middle;
  margin-left: 4px;
}

.subtitle {
  font-size: 13px;
  color: var(--color-text-dim);
  letter-spacing: 2px;
}

@media (max-width: 768px) {
  .hero h1 { font-size: 16px; }
  .hero { padding: 32px 12px 24px; }
}
</style>

