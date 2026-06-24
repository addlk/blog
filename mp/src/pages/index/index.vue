<template>
  <view class="page">
    <view class="hero">
      <text class="hero-title">分享技术 · 记录思考</text>
      <text class="hero-sub">个人技术博客</text>
    </view>
    
    <view v-if="loading" class="loading-wrap">
      <view class="spinner"><view class="s1"></view><view class="s2"></view><view class="s3"></view><view class="s4"></view></view>
      <text>加载中...</text>
    </view>
    
    <view v-else-if="error" class="error-wrap">
      <text>加载失败</text>
      <button class="btn-pixel" @click="loadArticles">重试</button>
    </view>
    
    <view v-else-if="!articles.length" class="empty-wrap">
      <text>暂无文章</text>
    </view>
    
    <scroll-view v-else scroll-y class="list" @scrolltolower="loadMore">
      <view v-for="(a, idx) in articles" :key="a.id" class="article-card" @click="goArticle(a.id)" :style="'animation-delay:' + (idx * 0.1) + 's'">
        <view class="card-meta">
          <text v-if="a.category" class="cat-badge">{{a.category.name}}</text>
          <text class="card-date">{{a.created_at ? a.created_at.slice(0,10) : ''}}</text>
          <text class="card-views">{{a.view_count || 0}} 阅读</text>
        </view>
        <text class="card-title">{{a.title}}</text>
        <text class="card-summary" v-if="a.summary">{{a.summary}}</text>
        <view class="card-tags" v-if="a.tags && a.tags.length">
          <text v-for="t in a.tags.slice(0,3)" :key="t.id" class="card-tag">{{t.name}}</text>
        </view>
      </view>
      <view class="load-more" v-if="hasMore">
        <text>加载更多...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getArticles } from '../../api/index'

export default {
  data() {
    return { articles: [], page: 1, loading: true, error: false, hasMore: true }
  },
  onLoad() { this.loadArticles() },
  methods: {
    async loadArticles() {
      this.loading = true; this.error = false
      try {
        const res = await getArticles({ page: this.page, pageSize: 10 })
        this.articles = res.records || []
        this.hasMore = (res.pages || 0) > this.page
      } catch(e) { this.error = true }
      finally { this.loading = false }
    },
    async loadMore() {
      if (!this.hasMore || this.loading) return
      this.page++
      try {
        const res = await getArticles({ page: this.page, pageSize: 10 })
        this.articles = this.articles.concat(res.records || [])
        this.hasMore = (res.pages || 0) > this.page
      } catch(e) { this.page-- }
    },
    goArticle(id) { uni.navigateTo({ url: '/pages/article/article?id=' + id }) }
  }
}
</script>

<style scoped>
.page { padding: 16px; min-height: 100vh; }
.hero { text-align: center; padding: 32px 0 24px; margin-bottom: 16px; }
.hero-title { font-size: 18px; color: #ffb347; text-shadow: 2px 2px 0 #2a2a5e; font-weight: bold; }
.hero-sub { display: block; font-size: 12px; color: #7c7caa; margin-top: 8px; }
.article-card { background: #1a1a3e; margin-bottom: 12px; padding: 16px; animation: fadeIn 0.4s forwards; }
.card-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 11px; }
.cat-badge { background: #ffb34722; color: #ffb347; padding: 2px 8px; }
.card-date { color: #7c7caa; }
.card-views { color: #7c7caa; margin-left: auto; }
.card-title { font-size: 16px; color: #e2e8f0; margin-bottom: 6px; display: block; }
.card-summary { font-size: 12px; color: #7c7caa; margin-bottom: 8px; display: block; }
.card-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.card-tag { font-size: 10px; padding: 2px 6px; background: #0f0f23; color: #22d3ee; }
.loading-wrap, .error-wrap, .empty-wrap { text-align: center; padding: 60px 0; color: #7c7caa; font-size: 13px; }
.btn-pixel { background: #ffb347; color: #0f0f23; padding: 8px 20px; margin-top: 12px; font-size: 13px; border: none; }
.list { min-height: 60vh; }
.load-more { text-align: center; padding: 16px; color: #7c7caa; font-size: 12px; }
.spinner { width: 32px; height: 32px; position: relative; margin: 0 auto 8px; }
.s1,.s2,.s3,.s4 { position: absolute; width: 12px; height: 12px; background: #ffb347; }
.s1 { top:0; left:0 } .s2 { top:0; right:0 } .s3 { bottom:0; right:0 } .s4 { bottom:0; left:0 }
.spinner .s1,.spinner .s2,.spinner .s3,.spinner .s4 { animation: spin 0.6s steps(4) infinite; }
.s2 { animation-delay: 0.15s } .s3 { animation-delay: 0.3s } .s4 { animation-delay: 0.45s }
@keyframes spin {
  0% { background: #ffb347; }
  25% { background: #2a2a5e; }
  50% { background: #2a2a5e; }
  100% { background: #2a2a5e; }
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; } }
</style>
