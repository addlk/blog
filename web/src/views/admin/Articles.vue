<template>
  <div class="articles-page">
    <div class="page-header-row">
      <h1 class="section-标题" style="margin:0;">[ 文章管理 ]</h1>
      <router-link to="/admin/articles/new" class="btn-pixel primary">[ 写文章 ]</router-link>
    </div>

    <div class="filter-bar">
      <input v-model="keyword" placeholder="搜索文章..." class="input-pixel" @input="debounceSearch" />
      <select v-model="statusFilter" class="select-pixel" @change="fetchArticles">
        <option value="">全部</option>
        <option value="已发布">已发布</option>
        <option value="草稿">草稿</option>
      </select>
    </div>

    <div class="manage-card" v-if="!loading">
      <table class="data-table">
        <thead><tr>
          <th>标题</th>
          <th>状态</th>
          <th>阅读</th>
          <th>时间</th>
          <th>操作</th>
        </tr></thead>
        <tbody>
          <tr v-for="a in list" :key="a.id" class="data-row">
            <td class="标题-cell">
              <div class="标题-text">{{ a.title }}</div>
              <div class="summary-text" v-if="a.summary">{{ a.summary }}</div>
            </td>
            <td>
              <button class="status-badge" :class="a.status" @click="toggleStatus(a)">
                {{ a.status === 'published' ? '[已发布]' : '[草稿]' }}
              </button>
            </td>
            <td>{{ a.view_count || 0 }}</td>
            <td>{{ (a.created_at || '').slice(0, 10) }}</td>
            <td class="actions-cell">
              <router-link :to="'/admin/articles/' + a.id" class="btn-action edit" title="编辑">[编辑]</router-link>
              <router-link v-if="a.status === 'published'" :to="'/article/' + a.id" class="btn-action view" title="查看" target="_blank">[查看]</router-link>
              <button class="btn-action delete" title="删除" @click="handleDelete(a.id, a.title)">[删除]</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="empty-state" v-if="!list.length" style="padding:32px;">
        <p>{{ keyword || statusFilter ? '没有匹配的文章' : '暂无文章' }}</p>
      </div>
      <div class="pagination" v-if="pages > 1">
        <button class="btn-page" :disabled="page <= 1" @click="goPage(page - 1)">[上一页]</button>
        <span class="page-info">{{ page }} / {{ pages }}</span>
        <button class="btn-page" :disabled="page >= pages" @click="goPage(page + 1)">[下一页]</button>
      </div>
    </div>
    <div class="loading-container" v-else>
      <div class="pixel-spinner"><div class="p1"></div><div class="p2"></div><div class="p3"></div><div class="p4"></div></div>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAdminArticles, deleteArticle, updateArticle } from '@/api'

const list = ref([])
const loading = ref(true)
const page = ref(1)
const pages = ref(0)
const pageSize = ref(10)
const statusFilter = ref('')
const keyword = ref('')
let debounceTimer = null

function debounceSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; fetchArticles() }, 300)
}

async function fetchArticles() {
  loading.value = true
  try {
    const data = await getAdminArticles({ page: page.value, pageSize: pageSize.value, status: statusFilter.value || undefined, keyword: keyword.value || undefined })
    list.value = data.records || []
    pages.value = data.pages || 0
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

function goPage(p) { page.value = p; fetchArticles() }

async function toggleStatus(a) {
  const newStatus = a.status === 'published' ? 'draft' : 'published'
  try {
    await updateArticle(a.id, { ...a, status: newStatus, tags: (a.tags || []).map(t => t.id) })
    a.status = newStatus
  } catch (e) { window.showToast('错误: ' + e.message, 'error') }
}

async function handleDelete(id, 标题) {
  if (!confirm('DELETE "' + 标题 + '"?')) return
  try { await deleteArticle(id); fetchArticles() }
  catch (e) { window.showToast('错误: ' + e.message, 'error') }
}

onMounted(fetchArticles)
</script>

<style scoped>
.articles-page { max-width: 1000px; }
.page-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.section-标题 { font-family: var(--font-display); font-size: 12px; color: var(--color-primary); text-shadow: 1px 1px 0 #2a2a5e; }

.filter-bar { display: flex; gap: 8px; margin-bottom: 16px; }
.input-pixel {
  flex: 1; padding: 8px 10px; background: var(--color-surface);
  border: none; color: var(--color-text); font-size: 13px;
  box-shadow: inset 3px 3px 0 0 var(--color-border); outline: none;
}
.input-pixel:focus { box-shadow: inset 3px 3px 0 0 var(--color-primary); }

.select-pixel {
  padding: 8px 10px; background: var(--color-surface); border: none;
  color: var(--color-text); font-size: 13px;
  box-shadow: inset 3px 3px 0 0 var(--color-border); outline: none;
  min-width: 120px;
}

.manage-card { background: var(--color-surface); box-shadow: 4px 4px 0 0 var(--color-border); overflow: hidden; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; font-size: 10px; color: var(--color-text-dim); padding: 10px 12px; border-bottom: 3px solid var(--color-border); }
.data-table td { padding: 10px 12px; font-size: 13px; color: var(--color-text); border-bottom: 1px solid var(--color-border); }
.标题-cell { max-width: 280px; }
.标题-text { font-weight: 400; color: var(--color-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.summary-text { font-size: 11px; color: var(--color-text-dim); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.status-badge { padding: 3px 8px; font-size: 10px; cursor: pointer; border: none; font-family: var(--font-mono); transition: all 0.1s steps(3); }
.status-badge.published { background: #4ade8022; color: var(--color-secondary); box-shadow: 2px 2px 0 0 var(--color-border); }
.status-badge.draft { background: #ffb34722; color: var(--color-primary); box-shadow: 2px 2px 0 0 var(--color-border); }
.status-badge:hover { box-shadow: 1px 1px 0 0 var(--color-border); transform: translate(1px, 1px); }

.actions-cell { display: flex; gap: 4px; white-space: nowrap; }
.btn-action { padding: 4px 8px; font-size: 10px; cursor: pointer; font-family: var(--font-mono); border: none; text-decoration: none; display: inline-block; transition: all 0.1s steps(3); }
.btn-action.edit { background: var(--color-primary-light); color: var(--color-primary); box-shadow: 2px 2px 0 0 var(--color-border); }
.btn-action.view { background: #4ade8022; color: var(--color-secondary); box-shadow: 2px 2px 0 0 var(--color-border); }
.btn-action.delete { background: #ef444422; color: var(--color-danger); box-shadow: 2px 2px 0 0 var(--color-border); }
.btn-action:hover { box-shadow: 1px 1px 0 0 var(--color-border); transform: translate(1px, 1px); }

.pagination { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 16px; }
.page-info { font-size: 12px; color: var(--color-text-dim); }
.loading-container { padding: 40px; text-align: center; color: var(--color-text-dim); }
.empty-state { text-align: center; font-size: 13px; color: var(--color-text-dim); }
</style>




