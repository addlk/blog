<template>
  <div class="dashboard">
    <h1 class="section-标题" style="margin:0 0 24px;">[ 仪表盘 ]</h1>

    <div class="stats-grid" v-if="!loading">
      <div class="stat-card">
        <div class="stat-num">{{ stats.articles }}</div>
        <div class="stat-label">文章总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" style="color:var(--color-secondary)">{{ stats.published }}</div>
        <div class="stat-label">已发布</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" style="color:var(--color-primary)">{{ stats.drafts }}</div>
        <div class="stat-label">草稿</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" style="color:var(--color-accent)">{{ stats.categories }}</div>
        <div class="stat-label">分类数</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" style="color:var(--color-tag)">{{ stats.tags }}</div>
        <div class="stat-label">标签数</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" style="color:var(--color-tag)">{{ stats.views }}</div>
        <div class="stat-label">总阅读</div>
      </div>
    </div>

    <div class="loading-container" v-else>
      <div class="pixel-spinner"><div class="p1"></div><div class="p2"></div><div class="p3"></div><div class="p4"></div></div>
      <p>加载中...</p>
    </div>

    <div class="recent-section">
      <div class="section-标题" style="margin-bottom:16px;">[ 最近文章 ]</div>
      <div class="recent-card" v-if="recent.length">
        <table class="data-table">
          <thead><tr><th>标题</th><th>状态</th><th>阅读</th><th>时间</th></tr></thead>
          <tbody>
            <tr v-for="a in recent" :key="a.id" class="data-row">
              <td class="标题-cell">{{ a.标题 }}</td>
              <td><span class="status-badge" :class="a.status">{{ a.status === 'published' ? '已发布' : '草稿' }}</span></td>
              <td>{{ a.view_count || 0 }}</td>
              <td>{{ (a.created_at || '').slice(0, 10) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="empty-state" v-else-if="!loading" style="padding:20px;">
        <p>暂无文章</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAdminArticles, getAdminCategories, getAdminTags } from '@/api'

const loading = ref(true)
const stats = ref({ articles: 0, published: 0, drafts: 0, categories: 0, tags: 0, views: 0 })
const recent = ref([])

onMounted(async () => {
  try {
    const [articleData, cats, tags] = await Promise.all([
      getAdminArticles({ pageSize: 999 }),
      getAdminCategories(),
      getAdminTags()
    ])
    const articles = articleData.records || []
    recent.value = articles.slice(0, 8)
    stats.value = {
      articles: articles.length,
      published: articles.filter(a => a.status === 'published').length,
      drafts: articles.filter(a => a.status === 'draft').length,
      categories: cats.length,
      tags: tags.length,
      views: articles.reduce((s, a) => s + (a.view_count || 0), 0)
    }
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})
</script>

<style scoped>
.dashboard { max-width: 900px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; margin-bottom: 24px; }

.stat-card {
  background: var(--color-surface);
  padding: 16px;
  box-shadow: 4px 4px 0 0 var(--color-border);
  text-align: center;
}

.stat-num {
  font-family: var(--font-display);
  font-size: 24px;
  color: var(--color-primary);
  margin-bottom: 4px;
}

.stat-label { font-size: 10px; color: var(--color-text-dim); }

.recent-section { background: var(--color-surface); padding: 20px; box-shadow: 4px 4px 0 0 var(--color-border); }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; font-size: 10px; color: var(--color-text-dim); padding: 8px 10px; border-bottom: 3px solid var(--color-border); }
.data-table td { padding: 8px 10px; font-size: 13px; color: var(--color-text); border-bottom: 1px solid var(--color-border); }
.标题-cell { max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.status-badge { padding: 2px 8px; font-size: 10px; }
.status-badge.已发布 { background: #4ade8022; color: var(--color-secondary); box-shadow: 2px 2px 0 0 var(--color-border); }
.status-badge.draft { background: #ffb34722; color: var(--color-primary); box-shadow: 2px 2px 0 0 var(--color-border); }

.section-标题 { font-family: var(--font-display); font-size: 12px; color: var(--color-primary); text-shadow: 1px 1px 0 #2a2a5e; }
.loading-container { padding: 40px; text-align: center; color: var(--color-text-dim); }
.empty-state { font-size: 13px; color: var(--color-text-dim); text-align: center; }
</style>






