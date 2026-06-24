<template>
  <div>
    <div class="page-header">
      <h1>[ {{ pageTitle }} ]</h1>
      <p style="font-size:13px;color:var(--color-text-dim);">浏览: {{ type === '分类' ? '分类' : '标签' }}</p>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="pixel-spinner"><div class="p1"></div><div class="p2"></div><div class="p3"></div><div class="p4"></div></div>
      <p>正在加载文章...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>加载失败</p>
      <button class="btn-pixel" @click="loadData">重试</button>
    </div>

    <div v-else-if="!articles.length" class="empty-state">
      <p>该{{ type === '分类' ? '分类' : '标签' }}</p>
      <router-link to="/" class="btn-pixel" style="display:inline-flex;margin-top:12px;">[返回首页]</router-link>
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
import { useRoute } from 'vue-router'
import { getArticles, getCategories, getTags } from '@/api'
import ArticleCard from '@/components/ArticleCard.vue'

const route = useRoute()
const props = defineProps({ type: { type: String, default: '分类' } })

const articles = ref([])
const loading = ref(true)
const error = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 10
const pageTitle = ref('')

const visiblePages = computed(() => {
  const total = totalPages.value, current = currentPage.value
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

async function loadData() {
  loading.value = true; error.value = false
  try {
    const filterId = route.params.id
    const params = { page: currentPage.value, pageSize }
    if (props.type === '分类') {
      params.分类Id = filterId
      const cats = await getCategories()
      const cat = (cats || []).find(c => String(c.id) === String(filterId))
      pageTitle.value = cat ? cat.name : 'UNKNOWN'
    } else {
      params.标签Id = filterId
      const tgs = await getTags()
      const 标签 = (tgs || []).find(t => String(t.id) === String(filterId))
      pageTitle.value = 标签 ? 标签.name : 'UNKNOWN'
    }
    const res = await getArticles(params)
    if (res && res.records) {
      articles.value = res.records
      totalPages.value = res.pages || 1
    } else { articles.value = []; totalPages.value = 1 }
  } catch (e) { console.error(e); error.value = true }
  finally { loading.value = false }
}

function goPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0 })
  loadData()
}

onMounted(loadData)
</script>



