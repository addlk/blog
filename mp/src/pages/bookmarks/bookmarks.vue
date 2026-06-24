<template>
  <view class="page">
    <text class="page-title">我的收藏</text>
    <view v-if="loading" class="loading-wrap"><text>加载中...</text></view>
    <view v-else-if="!list.length" class="empty-wrap"><text>暂无收藏</text></view>
    <view v-else>
      <view v-for="a in list" :key="a.id" class="article-card" @click="goArticle(a.id)">
        <text class="card-title">{{a.title}}</text>
        <text class="card-date">{{a.created_at ? a.created_at.slice(0,10) : ''}}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getBookmarks } from '../../api/index'
export default {
  data() { return { list: [], loading: true } },
  onLoad() { this.load() },
  methods: {
    async load() {
      try { this.list = (await getBookmarks({ pageSize: 99 })).records || [] }
      catch(e) {}
      finally { this.loading = false }
    },
    goArticle(id) { uni.navigateTo({ url: '/pages/article/article?id=' + id }) }
  }
}
</script>

<style scoped>
.page { padding: 16px; min-height: 100vh; }
.page-title { font-size: 16px; color: #ffb347; display: block; margin-bottom: 16px; }
.article-card { background: #1a1a3e; padding: 14px; margin-bottom: 10px; }
.card-title { font-size: 14px; color: #e2e8f0; display: block; margin-bottom: 4px; }
.card-date { font-size: 11px; color: #7c7caa; }
.loading-wrap, .empty-wrap { text-align: center; padding: 60px; color: #7c7caa; font-size: 13px; }
</style>
