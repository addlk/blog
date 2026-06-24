<template>
  <div class="article-edit" @keydown.meta.s.prevent="handleSave({keep: true})" @keydown.ctrl.s.prevent="handleSave({keep: true})">
    <div class="page-header">
      <div class="header-left">
        <h1>{{ isNew ? '写文章' : '编辑文章' }}</h1>
        <span class="save-indicator" v-if="lastSaved" :class="saveState">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          {{ saveText }}
        </span>
      </div>
      <router-link to="/admin/articles" class="btn-back">← 返回列表</router-link>
    </div>

    <!-- Editor Toolbar -->
    <div class="editor-toolbar">
      <div class="toolbar-group">
        <button class="tool-btn" title="加粗 (Ctrl+B)" @click="insertTag('strong')"><strong>B</strong></button>
        <button class="tool-btn" title="斜体 (Ctrl+I)" @click="insertTag('em')"><em>I</em></button>
        <span class="tool-sep"></span>
        <button class="tool-btn" title="标题 2" @click="insertTag('h2')">H2</button>
        <button class="tool-btn" title="标题 3" @click="insertTag('h3')">H3</button>
        <span class="tool-sep"></span>
        <button class="tool-btn" title="引用" @click="insertBlockTag('blockquote')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
        </button>
        <button class="tool-btn" title="代码块" @click="insertBlockTag('pre-code')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </button>
        <span class="tool-sep"></span>
        <button class="tool-btn" title="无序列表" @click="insertList('ul')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </button>
        <button class="tool-btn" title="有序列表" @click="insertList('ol')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
        </button>
        <span class="tool-sep"></span>
        <button class="tool-btn" title="插入链接" @click="insertLink">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </button>
        <button class="tool-btn" title="插入图片" @click="triggerImageUpload">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </button>
        <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="handleImageUpload" />
        <button class="tool-btn" title="分割线" @click="insertHR">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/></svg>
        </button>
      </div>
      <div class="toolbar-right">
        <span class="upload-status" v-if="uploading">上传中...</span>
        <span class="tool-sep"></span>
        <div class="view-mode-tabs">
          <button class="mode-tab" :class="{ active: viewMode === '编辑' }" @click="viewMode = '编辑'">编辑</button>
          <button class="mode-tab" :class="{ active: viewMode === 'preview' }" @click="viewMode = 'preview'">预览</button>
          <button class="mode-tab" :class="{ active: viewMode === 'split' }" @click="viewMode = 'split'">分屏</button>
        </div>
      </div>
    </div>

    <!-- Editor Body -->
    <div class="edit-layout" :class="{ 'preview-mode': viewMode === 'preview' }">
      <div class="edit-main" v-show="viewMode !== 'preview'">
        <div class="form-section">
          <div class="form-group">
            <input v-model="form.title" placeholder="输入文章标题..." class="input-title" ref="titleInput" />
          </div>
          <div class="form-group">
            <textarea v-model="form.summary" placeholder="文章摘要（可选，会显示在文章卡片上）" rows="2" class="input-summary"></textarea>
          </div>
          <div class="form-group editor-area">
            <textarea ref="editorRef" v-model="form.content" placeholder="开始写文章... 支持 HTML 格式，可以使用上方工具栏快速插入格式" class="input-content" @input="onContentChange" @keydown.tab.prevent="insertTab"></textarea>
          </div>
        </div>
      </div>

      <!-- Preview Pane -->
      <div class="preview-pane" v-show="viewMode !== '编辑'">
        <div class="preview-header" v-if="!form.content.trim()">
          <div class="preview-placeholder">预览区域 — 输入内容后即可预览</div>
        </div>
        <div class="preview-scroll" v-else>
          <article class="preview-article">
            <h1 class="preview-title">{{ form.title || '(无标题)' }}</h1>
            <div class="preview-content" v-html="form.content"></div>
          </article>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="edit-sidebar" v-show="viewMode !== 'preview'">
        <div class="sidebar-card">
          <h3>发布</h3>
          <div class="publish-actions">
            <button class="btn-publish" @click="handleSave({keep: false, forcePublish: true})" :disabled="saving" title="发布并返回列表">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              发布
            </button>
            <button class="btn-draft" @click="handleSave({keep: true})" :disabled="saving" title="保存为草稿 (Ctrl+S)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              保存草稿
            </button>
          </div>
          <div class="save-hint">按 Ctrl+S 快速保存</div>
          <div class="save-info" v-if="lastSaved">
            <span class="info-label">{{ isNew ? '保存状态:' : '最后保存:' }}</span>
            <span class="info-value">{{ lastSaved }}</span>
          </div>
        </div>

        <div class="sidebar-card">
          <h3>文章设置</h3>
          <div class="form-group">
            <label>状态</label>
            <select v-model="form.status" class="input-select">
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            </select>
          </div>
          <div class="form-group">
            <label>分类</label>
            <select v-model="form.category_id" class="input-select">
              <option :value="null">无分类</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>封面图</label>
            <div class="cover-input-row">
              <input v-model="form.cover_image" placeholder="图片 URL" class="input-text" />
              <button class="btn-upload-cover" @click="triggerCoverUpload" title="上传封面">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </button>
            </div>
            <div class="cover-preview" v-if="form.cover_image">
              <img :src="form.cover_image" @error="coverError = true" :class="{ error: coverError }" />
              <button class="cover-remove" @click="form.cover_image = ''; coverError = false">×</button>
            </div>
          </div>
        </div>

        <div class="sidebar-card">
          <h3>标签</h3>
          <div class="tag-selector" v-if="allTags.length">
            <label v-for="t in allTags" :key="t.id" class="tag-option">
              <input type="checkbox" :value="t.id" v-model="selectedTags" />
              <span>{{ t.name }}</span>
            </label>
          </div>
          <div class="empty-tags" v-else>暂无标签</div>
          <div class="selected-tags-info" v-if="selectedTags.length">
            <span>已选 {{ selectedTags.length }} 个标签</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Image upload overlay -->
    <div class="upload-overlay" v-if="uploading">
      <div class="upload-progress">
        <div class="spinner"></div>
        <p>正在上传图片...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAdminArticle, createArticle, updateArticle, getAdminCategories, getAdminTags, uploadImage } from '@/api'

const route = useRoute()
const router = useRouter()
const articleId = computed(() => route.params.id)
const isNew = computed(() => !articleId.value || articleId.value === 'new')

const editorRef = ref(null)
const fileInput = ref(null)
const titleInput = ref(null)

const saving = ref(false)
const uploading = ref(false)
const categories = ref([])
const allTags = ref([])
const selectedTags = ref([])
const coverError = ref(false)
const lastSaved = ref('')
const saveState = ref('saved')
const viewMode = ref('编辑')
const autoSaveTimer = ref(null)
const hasChanges = ref(false)

const STORAGE_KEY = 'blog_article_draft'
const AUTOSAVE_INTERVAL = 30000

const form = reactive({
  title: '',
  summary: '',
  content: '',
  cover_image: '',
  status: 'draft',
  category_id: null
})

const saveText = computed(() => {
  if (saveState.value === 'saving') return '保存中...'
  if (saveState.value === 'saved') return '已保存'
  if (saveState.value === 'error') return '保存失败'
  if (saveState.value === 'unsaved') return '未保存'
  return ''
})

function insertTag(tag) {
  const textarea = editorRef.value
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = form.content
  const selected = text.substring(start, end)
  const insertion = `<${tag}>${selected}</${tag}>`
  form.content = text.substring(0, start) + insertion + text.substring(end)
  onContentChange()
  nextTick(() => {
    textarea.focus()
    textarea.selectionStart = textarea.selectionEnd = start + insertion.length - (selected ? 0 : tag.length - 2)
  })
}

function insertBlockTag(type) {
  const textarea = editorRef.value
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = form.content
  const selected = text.substring(start, end) || '内容'
  let insertion
  if (type === 'pre-code') {
    insertion = `\n<pre><code>${selected}</code></pre>\n`
  } else {
    insertion = `\n<${type}><p>${selected}</p></${type}>\n`
  }
  form.content = text.substring(0, start) + insertion + text.substring(end)
  onContentChange()
}

function insertList(type) {
  const textarea = editorRef.value
  if (!textarea) return
  const start = textarea.selectionStart
  const text = form.content
  const insertion = `\n<${type}>\n  <li>项目 1</li>\n  <li>项目 2</li>\n  <li>项目 3</li>\n</${type}>\n`
  form.content = text.substring(0, start) + insertion + text.substring(start)
  onContentChange()
}

function insertHR() {
  const textarea = editorRef.value
  if (!textarea) return
  const start = textarea.selectionStart
  const text = form.content
  form.content = text.substring(0, start) + '\n<hr />\n' + text.substring(start)
  onContentChange()
}

function insertLink() {
  const url = prompt('输入链接地址:', 'https://')
  if (!url) return
  const textarea = editorRef.value
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = form.content
  const selected = text.substring(start, end) || url
  const insertion = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selected}</a>`
  form.content = text.substring(0, start) + insertion + text.substring(end)
  onContentChange()
}

function triggerImageUpload() { fileInput.value?.click() }

async function handleImageUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > 20 * 1024 * 1024) { window.showToast('图片不能超过 20MB', 'error'); return }
  uploading.value = true
  try {
    const result = await uploadImage(file)
    const textarea = editorRef.value
    if (textarea) {
      const start = textarea.selectionStart
      const text = form.content
      const imgTag = `\n<img src="${result.url}" alt="${file.name}" />\n`
      form.content = text.substring(0, start) + imgTag + text.substring(start)
      onContentChange()
    }
  } catch (e) { window.showToast('上传失败: ' + (e?.response?.data?.msg || e?.message || 'UNKNOWN'), 'error') }
  finally { uploading.value = false; e.target.value = '' }
}

let coverFileInput = null
function triggerCoverUpload() {
  if (!coverFileInput) {
    coverFileInput = document.createElement('input')
    coverFileInput.type = 'file'
    coverFileInput.accept = 'image/*'
    coverFileInput.style.display = 'none'
    document.body.appendChild(coverFileInput)
    coverFileInput.addEventListener('change', async (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      uploading.value = true
      try {
        const result = await uploadImage(file)
        form.cover_image = result.url
        coverError.value = false
      } catch (e) { window.showToast('上传失败: ' + (e?.response?.data?.msg || e?.message || 'UNKNOWN'), 'error') }
      finally { uploading.value = false; e.target.value = '' }
    })
  }
  coverFileInput.click()
}

function insertTab(e) {
  const textarea = editorRef.value
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = form.content
  form.content = text.substring(0, start) + '  ' + text.substring(end)
  onContentChange()
  nextTick(() => { textarea.selectionStart = textarea.selectionEnd = start + 2 })
}

function onContentChange() { hasChanges.value = true }

function formatTime() {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
}

function autoSaveToStorage() {
  if (!hasChanges.value) return
  try {
    const data = {
      title: form.title,
      summary: form.summary,
      content: form.content,
      cover_image: form.cover_image,
      status: form.status,
      category_id: form.category_id,
      selectedTags: selectedTags.value,
      updatedAt: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) { /* storage full, ignore */ }
}

function restoreFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const data = JSON.parse(raw)
    if (!data.title && !data.content) return
    if (Date.now() - data.updatedAt > 86400000) { localStorage.removeItem(STORAGE_KEY); return }
    if (confirm('检测到未保存的草稿，是否恢复？')) {
      form.title = data.title || ''
      form.summary = data.summary || ''
      form.content = data.content || ''
      form.cover_image = data.cover_image || ''
      form.status = data.status || 'draft'
      form.category_id = data.category_id || null
      selectedTags.value = data.selectedTags || []
      lastSaved.value = new Date(data.updatedAt).toLocaleString('zh-CN')
      saveState.value = 'unsaved'
      hasChanges.value = true
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch (e) { /* ignore */ }
}

function clearStorage() {
  localStorage.removeItem(STORAGE_KEY)
}

async function handleSave({ keep = false, forcePublish = false } = {}) {
  if (!form.title.trim()) {
    titleInput.value?.focus()
    window.showToast('请输入文章标题', 'error')
    return
  }
  saving.value = true
  saveState.value = 'saving'
  const currentStatus = form.status
  if (forcePublish) form.status = 'published'
  try {
    const payload = { ...form, tags: selectedTags.value }
    if (isNew.value) {
      const result = await createArticle(payload)
      form.status = currentStatus
      clearStorage()
      hasChanges.value = false
      if (!keep) { router.push('/admin/articles'); return }
      router.replace(`/admin/articles/${result.id}`)
      lastSaved.value = formatTime()
      saveState.value = 'saved'
    } else {
      await updateArticle(articleId.value, payload)
      clearStorage()
      hasChanges.value = false
      lastSaved.value = formatTime()
      saveState.value = 'saved'
      if (!keep) router.push('/admin/articles')
    }
  } catch (e) {
    saveState.value = 'error'
    window.showToast('保存失败: ' + (e.message || 'UNKNOWN'), 'error')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    const [cats, tags] = await Promise.all([getAdminCategories(), getAdminTags()])
    categories.value = cats
    allTags.value = tags
  } catch (e) { console.error(e) }

  if (!isNew.value) {
    try {
      const article = await getAdminArticle(articleId.value)
      form.title = article.title
      form.summary = article.summary || ''
      form.content = article.content || ''
      form.cover_image = article.cover_image || ''
      form.status = article.status || 'draft'
      form.category_id = article.category_id || null
      selectedTags.value = (article.tags || []).map(t => t.id)
    } catch (e) {
      window.showToast('文章不存在', 'error')
      router.push('/admin/articles')
    }
  } else {
    restoreFromStorage()
  }

  // Auto-save timer
  if (isNew.value) {
    autoSaveTimer.value = setInterval(autoSaveToStorage, AUTOSAVE_INTERVAL)
  }
  // Warn before leaving with unsaved changes
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  if (autoSaveTimer.value) clearInterval(autoSaveTimer.value)
  window.removeEventListener('beforeunload', handleBeforeUnload)
  if (isNew.value && hasChanges.value) autoSaveToStorage()
})

function handleBeforeUnload(e) {
  if (hasChanges.value) {
    autoSaveToStorage()
    e.preventDefault()
    e.returnValue = ''
  }
}
</script>

<style scoped>
.article-edit { max-width: 1200px; }

/* Header */
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
.header-left { display: flex; align-items: center; gap: 16px; }
.page-header h1 { font-size: 20px; font-weight: 700; color: var(--color-text); margin: 0; white-space: nowrap; }
.btn-back { color: var(--color-primary); text-decoration: none; font-size: 13px; white-space: nowrap; }
.btn-back:hover { text-decoration: underline; }
.save-indicator { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: var(--color-text-dim); white-space: nowrap; }
.save-indicator.saving { color: var(--color-primary); }
.save-indicator.saved { color: var(--color-secondary); }
.save-indicator.error { color: var(--color-danger); }
.save-indicator.unsaved { color: var(--color-primary); }

/* Toolbar */
.editor-toolbar {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;
  background: var(--color-surface); border: 1px solid var(--color-border);  padding: 6px 12px; margin-bottom: 12px;
}
.toolbar-group { display: flex; align-items: center; gap: 2px; flex-wrap: wrap; }
.toolbar-right { display: flex; align-items: center; gap: 6px; }
.tool-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border: none;  background: transparent;
  color: var(--color-text-secondary); font-size: 13px; cursor: pointer; transition: all 0.15s;
}
.tool-btn:hover { background: var(--color-border); color: var(--color-text); }
.tool-sep { width: 1px; height: 20px; background: var(--color-border); margin: 0 4px; }
.tool-btn strong { font-size: 14px; }
.tool-btn em { font-style: italic; font-size: 14px; }
.upload-status { font-size: 12px; color: var(--color-primary); }

/* View mode tabs */
.view-mode-tabs { display: flex;  overflow: hidden; border: 1px solid var(--color-border); }
.mode-tab {
  padding: 4px 12px; border: none; background: var(--color-surface); font-size: 12px; color: var(--color-text-dim); cursor: pointer;
  transition: all 0.15s;
}
.mode-tab:not(:last-child) { border-right: 1px solid var(--color-border); }
.mode-tab:hover { color: var(--color-primary); }
.mode-tab.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }

/* Editor layout */
.edit-layout { display: grid; grid-template-columns: 1fr 280px; gap: 16px; }
.edit-layout.preview-mode { grid-template-columns: 1fr; }

.edit-main { min-width: 0; }
.form-section { background: var(--color-surface);  padding: 20px; box-shadow: 4px 4px 0 0 var(--color-border); }

.form-group { margin-bottom: 12px; }
.form-group:last-child { margin-bottom: 0; }
.form-group label { display: block; font-size: 12px; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; }

.input-title {
  width: 100%; padding: 12px 0; border: none; border-bottom: 1px solid var(--color-border);
  font-size: 22px; font-weight: 700; outline: none; background: transparent;
  color: var(--color-text); box-sizing: border-box; font-family: inherit;
}
.input-title::placeholder { color: var(--color-text-dim); }
.input-title:focus { border-bottom-color: var(--color-primary); }

.input-summary {
  width: 100%; padding: 8px 0; border: none; border-bottom: 1px solid var(--color-border);
  font-size: 14px; outline: none; background: transparent; color: var(--color-text-secondary);
  resize: vertical; box-sizing: border-box; font-family: inherit;
}
.input-summary:focus { border-bottom-color: var(--color-primary); }

.editor-area { margin-top: 8px; }
.input-content {
  width: 100%; min-height: 400px; padding: 12px; border: 1px solid var(--color-border); 
  font-family: 'Consolas', 'Courier New', monospace; font-size: 14px; line-height: 1.7; color: var(--color-text);
  resize: vertical; outline: none; box-sizing: border-box; background: var(--color-bg);
}
.input-content:focus { border-color: var(--color-primary); background: var(--color-surface); }

/* Preview */
.preview-pane { background: var(--color-surface);  box-shadow: 4px 4px 0 0 var(--color-border); overflow: hidden; }
.preview-header { padding: 60px 40px; text-align: center; }
.preview-placeholder { color: var(--color-text-dim); font-size: 14px; }
.preview-scroll { max-height: 80vh; overflow-y: auto; padding: 32px 40px; }
.preview-title { font-size: 26px; font-weight: 700; color: var(--color-text); margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--color-border); }
.preview-content { font-size: 15px; line-height: 1.8; color: var(--color-text); }
.preview-content :deep(h2) { font-size: 20px; margin: 28px 0 12px; font-weight: 600; padding-bottom: 8px; border-bottom: 1px solid var(--color-border); }
.preview-content :deep(h3) { font-size: 17px; margin: 24px 0 10px; font-weight: 600; }
.preview-content :deep(p) { margin-bottom: 14px; }
.preview-content :deep(img) { max-width: 100%;  margin: 12px 0; }
.preview-content :deep(blockquote) { margin: 14px 0; padding: 10px 16px; border-left: 4px solid var(--color-primary); background: #f8f9ff; border-radius: 0 4px 4px 0; }
.preview-content :deep(pre) { background: #1e293b; color: #e2e8f0; padding: 14px 18px;  overflow-x: auto; margin: 14px 0; font-size: 13px; }
.preview-content :deep(code) { font-size: .9em; padding: 2px 5px; background: var(--color-bg); border-radius: 3px; }
.preview-content :deep(pre code) { background: none; padding: 0; }
.preview-content :deep(ul), .preview-content :deep(ol) { margin: 12px 0; padding-left: 24px; }
.preview-content :deep(li) { margin-bottom: 6px; }
.preview-content :deep(a) { color: var(--color-primary); }
.preview-content :deep(hr) { margin: 20px 0; border: none; border-top: 1px solid var(--color-border); }

/* Sidebar */
.edit-sidebar { min-width: 0; }
.sidebar-card { background: var(--color-surface);  padding: 16px; margin-bottom: 12px; box-shadow: 4px 4px 0 0 var(--color-border); }
.sidebar-card h3 { font-size: 13px; font-weight: 600; color: var(--color-text); margin: 0 0 10px; padding-bottom: 8px; border-bottom: 1px solid var(--color-border); }

.publish-actions { display: flex; flex-direction: column; gap: 8px; }
.btn-publish {
  width: 100%; padding: 10px; border: none;  cursor: pointer;
  background: var(--color-primary); color: #fff; font-size: 14px; font-weight: 600;
  display: flex; align-items: center; justify-content: center; gap: 6px; transition: opacity 0.2s;
}
.btn-publish:hover { opacity: 0.9; }
.btn-publish:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-draft {
  width: 100%; padding: 10px; border: 1.5px solid var(--color-border);  cursor: pointer;
  background: var(--color-surface); color: var(--color-text-secondary); font-size: 13px; font-weight: 500;
  display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;
}
.btn-draft:hover { border-color: var(--color-primary); color: var(--color-primary); }
.btn-draft:disabled { opacity: 0.6; cursor: not-allowed; }
.save-hint { text-align: center; font-size: 11px; color: var(--color-text-dim); margin-top: 6px; }
.save-info { margin-top: 8px; font-size: 11px; color: var(--color-text-dim); display: flex; gap: 4px; }
.info-label { color: #aaa; }
.info-value { color: var(--color-text-secondary); font-weight: 500; }

.input-select, .input-text {
  width: 100%; padding: 8px 10px; border: 1.5px solid var(--color-border); 
  font-size: 13px; outline: none; background: var(--color-surface); box-sizing: border-box; font-family: inherit;
}
.input-select:focus, .input-text:focus { border-color: var(--color-primary); }

.cover-input-row { display: flex; gap: 6px; }
.cover-input-row .input-text { flex: 1; }
.btn-upload-cover {
  width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;
  border: 1.5px solid var(--color-border);  background: var(--color-surface); cursor: pointer; flex-shrink: 0;
}
.btn-upload-cover:hover { border-color: var(--color-primary); color: var(--color-primary); }
.cover-preview { position: relative; margin-top: 8px;  overflow: hidden; }
.cover-preview img { width: 100%; height: 80px; object-fit: cover; display: block; }
.cover-preview img.error { display: none; }
.cover-remove {
  position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; display: flex;
  align-items: center; justify-content: center; border: none; 
  background: rgba(0,0,0,0.5); color: #fff; font-size: 14px; cursor: pointer;
}

.tag-selector { display: flex; flex-direction: column; gap: 4px; max-height: 200px; overflow-y: auto; }
.tag-option { display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 4px 0; }
.tag-option input { width: 14px; height: 14px; accent-color: var(--color-primary); cursor: pointer; }
.tag-option span { font-size: 13px; color: var(--color-text-secondary); }
.empty-tags { font-size: 12px; color: var(--color-text-dim); text-align: center; padding: 8px; }
.selected-tags-info { margin-top: 6px; font-size: 11px; color: var(--color-primary); }

/* Upload overlay */
.upload-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.3); display: flex;
  align-items: center; justify-content: center; z-index: 1000;
}
.upload-progress {
  background: var(--color-surface); border-radius: 12px; padding: 32px 48px;
  text-align: center; box-shadow: 8px 8px 0 0 var(--color-border);
}
.upload-progress p { margin-top: 12px; font-size: 14px; color: var(--color-text-secondary); }

@media (max-width: 768px) {
  .edit-layout { grid-template-columns: 1fr; }
  .editor-toolbar { padding: 6px 8px; }
  .preview-scroll { padding: 16px; }
}
</style>




