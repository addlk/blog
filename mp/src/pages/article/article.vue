<template>
  <view class="page">
    <view v-if="loading" class="loading-wrap"><text>加载中...</text></view>
    <view v-else-if="article" class="article-detail">
      <text class="article-title">{{article.title}}</text>
      <view class="article-meta" v-if="article.category">
        <text class="cat-badge">{{article.category.name}}</text>
        <text class="meta-text">{{article.created_at ? article.created_at.slice(0,10) : ''}}</text>
        <text class="meta-text">{{article.view_count || 0}} 次阅读</text>
      </view>
      <view class="article-content">
        <rich-text :nodes="article.content"></rich-text>
      </view>
      <view class="action-bar">
        <view class="action-btn" @click="handleLike">
          <text :class="liked ? 'liked' : ''">❤ {{likeCount}}</text>
        </view>
        <view class="action-btn" @click="showCommentInput = !showCommentInput">
          <text>💬 {{commentCount}}</text>
        </view>
        <view class="action-btn" @click="handleBookmark">
          <text :class="bookmarked ? 'bookmarked' : ''">⭐</text>
        </view>
      </view>
      <view v-if="showCommentInput" class="comment-input-wrap">
        <input v-model="commentText" class="comment-input" placeholder="写下评论..." />
        <button class="btn-pixel" @click="submitComment" :disabled="!commentText.trim()">发表</button>
      </view>
      <view class="comments-section" v-if="comments.length">
        <text class="section-title">评论</text>
        <view v-for="c in comments" :key="c.id" class="comment-item">
          <text class="comment-user">{{c.nickname || '匿名用户'}}</text>
          <text class="comment-content">{{c.content}}</text>
          <text class="comment-time">{{c.created_at ? c.created_at.slice(0,16) : ''}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getArticleDetail, getComments, postComment, toggleLike, getLikeStatus, toggleBookmark } from '../../api/index'
import { getToken } from '../../api/request'

export default {
  data() {
    return {
      article: null, loading: true, liked: false, likeCount: 0,
      bookmarked: false, comments: [], commentCount: 0, commentText: '',
      showCommentInput: false
    }
  },
  onLoad(options) {
    this.articleId = options.id
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const [article, comments] = await Promise.all([
          getArticleDetail(this.articleId),
          getComments(this.articleId)
        ])
        this.article = article
        this.comments = comments || []
        this.commentCount = (comments || []).length
        if (getToken()) {
          try {
            const status = await getLikeStatus(this.articleId)
            this.liked = status.liked
            this.likeCount = status.count
          } catch(e) {}
        }
      } catch(e) { uni.showToast({ title: '加载失败', icon: 'none' }) }
      finally { this.loading = false }
    },
    async handleLike() {
      try {
        const res = await toggleLike(this.articleId)
        this.liked = res.liked
        if (res.count !== undefined) this.likeCount = res.count
        if (this.liked) this.likeCount++
        else this.likeCount--
      } catch(e) { uni.showToast({ title: '操作失败', icon: 'none' }) }
    },
    async handleBookmark() {
      try {
        const res = await toggleBookmark(this.articleId)
        this.bookmarked = res.bookmarked
        uni.showToast({ title: res.bookmarked ? '已收藏' : '已取消收藏', icon: 'none' })
      } catch(e) { uni.showToast({ title: '操作失败', icon: 'none' }) }
    },
    async submitComment() {
      if (!this.commentText.trim()) return
      try {
        await postComment(this.articleId, this.commentText.trim())
        this.commentText = ''
        this.showCommentInput = false
        const comments = await getComments(this.articleId)
        this.comments = comments || []
        this.commentCount = (comments || []).length
        uni.showToast({ title: '评论成功', icon: 'none' })
      } catch(e) { uni.showToast({ title: '发表失败', icon: 'none' }) }
    }
  }
}
</script>

<style scoped>
.page { padding: 16px; min-height: 100vh; }
.article-detail { background: #1a1a3e; padding: 20px; }
.article-title { font-size: 20px; color: #ffb347; display: block; margin-bottom: 12px; text-shadow: 1px 1px 0 #2a2a5e; }
.article-meta { display: flex; gap: 10px; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #2a2a5e; }
.meta-text { font-size: 12px; color: #7c7caa; }
.cat-badge { background: #ffb34722; color: #ffb347; padding: 2px 8px; font-size: 11px; }
.article-content { font-size: 14px; line-height: 1.8; color: #e2e8f0; margin-bottom: 20px; }
.action-bar { display: flex; gap: 24px; padding: 12px 0; border-top: 2px solid #2a2a5e; border-bottom: 2px solid #2a2a5e; }
.action-btn { color: #7c7caa; font-size: 14px; }
.action-btn .liked { color: #f472b6; }
.action-btn .bookmarked { color: #ffb347; }
.comment-input-wrap { display: flex; gap: 8px; padding: 12px 0; }
.comment-input { flex: 1; background: #0f0f23; color: #e2e8f0; padding: 8px; font-size: 13px; border: none; }
.btn-pixel { background: #ffb347; color: #0f0f23; padding: 8px 16px; font-size: 12px; border: none; }
.comments-section { margin-top: 16px; }
.section-title { font-size: 14px; color: #ffb347; display: block; margin-bottom: 12px; }
.comment-item { padding: 10px 0; border-bottom: 1px solid #2a2a5e; }
.comment-user { font-size: 12px; color: #22d3ee; display: block; margin-bottom: 4px; }
.comment-content { font-size: 13px; color: #e2e8f0; display: block; margin-bottom: 4px; }
.comment-time { font-size: 10px; color: #7c7caa; }
.loading-wrap { text-align: center; padding: 60px; color: #7c7caa; }
</style>
