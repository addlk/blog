<template>
  <view class="page">
    <text class="section-title">全部分类</text>
    <view v-if="loading" class="loading-wrap"><text>加载中...</text></view>
    <view v-else class="category-grid">
      <view v-for="c in categories" :key="c.id" class="cat-item" @click="goCategory(c.id)">
        <text class="cat-name">{{c.name}}</text>
        <text class="cat-count">{{c.articleCount || 0}} 篇</text>
      </view>
    </view>
    <text class="section-title" style="margin-top:24px;">热门标签</text>
    <view class="tag-cloud" v-if="!loading">
      <text v-for="t in tags" :key="t.id" class="tag-item" @click="goTag(t.id)">{{t.name}}</text>
    </view>
  </view>
</template>

<script>
import { getCategories, getTags } from '../../api/index'
export default {
  data() { return { categories: [], tags: [], loading: true } },
  onLoad() { this.load() },
  methods: {
    async load() {
      try { [this.categories, this.tags] = await Promise.all([getCategories(), getTags()]) }
      catch(e) {}
      finally { this.loading = false }
    },
    goCategory(id) { uni.navigateTo({ url: '/pages/article/article?categoryId=' + id }) },
    goTag(id) { uni.navigateTo({ url: '/pages/article/article?tagId=' + id }) }
  }
}
</script>

<style scoped>
.page { padding: 16px; min-height: 100vh; }
.section-title { font-size: 14px; color: #f472b6; display: block; margin-bottom: 12px; }
.category-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.cat-item { background: #1a1a3e; padding: 16px; text-align: center; }
.cat-name { font-size: 14px; color: #ffb347; display: block; margin-bottom: 4px; }
.cat-count { font-size: 11px; color: #7c7caa; }
.tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
.tag-item { padding: 6px 14px; background: #1a1a3e; color: #22d3ee; font-size: 12px; }
.loading-wrap { text-align: center; padding: 60px; color: #7c7caa; }
</style>
