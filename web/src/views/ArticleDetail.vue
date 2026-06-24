<template>
  <div>
    <div v-if="loading" class="loading-container">
      <div class="pixel-spinner"><div class="p1"></div><div class="p2"></div><div class="p3"></div><div class="p4"></div></div>
      <p>正在加载文章...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>文章加载失败</p>
      <button class="btn-pixel" @click="loadArticle">重试</button>
    </div>

    <template v-else-if="article">
      <article class="article-detail">
        <header class="article-header">
          <div class="article-meta">
            <router-link v-if="article.category" :to="'/category/' + article.category.id" class="article-badge">
              {{ article.category.name }}
            </router-link>
            <span class="article-time">{{ formatDate(article.created_at) }}</span>
            <span class="article-次阅读" v-if="article.view_count !== undefined">
              {{ article.view_count }} 次阅读
            </span>
          </div>
          <h1 class="article-title">{{ article.title }}</h1>
        </header>

        <div class="article-content" v-if="article.content" v-html="article.content"></div>

        <footer class="article-footer" v-if="article.tags && article.tags.length">
          <div class="article-tags">
            <span class="tags-label">[标签]</span>
            <router-link v-for="tag in article.tags" :key="tag.id" :to="'/tag/' + tag.id" class="article-tag">
              {{ tag.name }}
            </router-link>
          </div>
        </footer>

        <div class="article-nav">
          <router-link to="/" class="btn-pixel">[返回首页]</router-link>
        </div>
      </article>
    </template>

    <div v-else class="empty-state">
      <p>文章不存在</p>
      <router-link to="/" class="btn-pixel" style="display:inline-flex;margin-top:12px;">[返回首页]</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleDetail } from '@/api'

const route = useRoute()
const article = ref(null)
const loading = ref(true)
const error = ref(false)

async function loadArticle() {
  loading.value = true
  error.value = false
  article.value = null
  try {
    const res = await getArticleDetail(route.params.id)
    article.value = res || null
  } catch (e) {
    console.error('Failed to load article detail:', e)
    error.value = true
  } finally { loading.value = false }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

onMounted(loadArticle)
</script>

<style scoped>
.article-detail {
  background: var(--color-surface);
  padding: 32px;
  box-shadow: 4px 4px 0 0 var(--color-border);
}

.article-header {
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 3px solid var(--color-border);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  font-size: 12px;
}

.article-badge {
  padding: 3px 10px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 11px;
  box-shadow: 2px 2px 0 0 var(--color-border);
  text-decoration: none;
}

.article-time { color: var(--color-text-dim); }
.article-次阅读 { color: var(--color-text-dim); margin-left: auto; }

.article-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  color: var(--color-primary);
  line-height: 1.4;
  text-shadow: 2px 2px 0 #2a2a5e;
}

.article-content {
  font-size: 14px;
  line-height: 1.9;
  color: var(--color-text);
  margin-bottom: 28px;
}

.article-content :deep(h2) {
  font-size: 18px;
  margin: 32px 0 16px;
  font-weight: 400;
  color: var(--color-primary);
  padding-bottom: 8px;
  border-bottom: 2px solid var(--color-border);
}

.article-content :deep(h3) {
  font-size: 16px;
  margin: 28px 0 12px;
  font-weight: 400;
  color: var(--color-secondary);
}

.article-content :deep(p) {
  margin-bottom: 16px;
}

.article-content :deep(img) {
  max-width: 100%;
  margin: 16px 0;
  display: block;
  box-shadow: 4px 4px 0 0 var(--color-border);
}

.article-content :deep(blockquote) {
  margin: 16px 0;
  padding: 12px 20px;
  border-left: 4px solid var(--color-primary);
  background: var(--color-bg);
  color: var(--color-text-dim);
  box-shadow: 4px 4px 0 0 var(--color-border);
}

.article-content :deep(pre) {
  background: #0a0a1a;
  color: var(--color-secondary);
  padding: 16px 20px;
  overflow-x: auto;
  margin: 16px 0;
  font-size: 13px;
  line-height: 1.6;
  box-shadow: 4px 4px 0 0 var(--color-border);
}

.article-content :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.9em;
  padding: 2px 6px;
  background: #0a0a1a;
  color: var(--color-tag);
}

.article-content :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin: 16px 0;
  padding-left: 24px;
}

.article-content :deep(li) { margin-bottom: 8px; }

.article-content :deep(ul) { list-style: disc; }
.article-content :deep(ol) { list-style: decimal; }

.article-content :deep(a) { color: var(--color-primary); text-decoration: underline; }
.article-content :deep(a:hover) { color: var(--color-primary); filter: brightness(1.2); }

.article-content :deep(hr) {
  border: none;
  border-top: 3px solid var(--color-border);
  margin: 24px 0;
}

.article-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  box-shadow: 4px 4px 0 0 var(--color-border);
}

.article-content :deep(th),
.article-content :deep(td) {
  border: 2px solid var(--color-border);
  padding: 8px 12px;
  text-align: left;
}

.article-content :deep(th) { background: var(--color-bg); font-weight: 400; }

.article-footer {
  padding-top: 20px;
  border-top: 2px solid var(--color-border);
}

.article-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tags-label { font-size: 12px; color: var(--color-text-dim); }

.article-tag {
  display: inline-block;
  padding: 3px 10px;
  background: var(--color-bg);
  color: var(--color-tag);
  font-size: 11px;
  text-decoration: none;
  box-shadow: 2px 2px 0 0 var(--color-border);
  transition: all 0.1s steps(3);
}

.article-tag:hover { background: var(--color-surface-hover); color: var(--color-tag); }

.article-nav { margin-top: 24px; }

@media (max-width: 768px) {
  .article-detail { padding: 20px; }
  .article-title { font-size: 18px; }
}
</style>

