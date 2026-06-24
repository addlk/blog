<template>
  <view class="page">
    <view class="profile-card">
      <view class="avatar">{{initial}}</view>
      <text class="nickname">{{nickname}}</text>
    </view>
    <view class="info-section">
      <view class="info-row"><text class="info-label">阅读文章</text><text class="info-value">{{stats.views || 0}}</text></view>
      <view class="info-row"><text class="info-label">收藏文章</text><text class="info-value">{{stats.bookmarks || 0}}</text></view>
      <view class="info-row"><text class="info-label">已发布文章</text><text class="info-value">{{stats.articles || 5}}</text></view>
    </view>
  </view>
</template>

<script>
export default {
  data() { return { nickname: '访客', initial: '访', stats: {} } },
  onLoad() {
    this.nickname = '读者'
    this.initial = '读'
  }
}
</script>

<style scoped>
.page { padding: 16px; min-height: 100vh; }
.profile-card { background: #1a1a3e; padding: 24px; text-align: center; margin-bottom: 16px; }
.avatar { width: 48px; height: 48px; background: #ffb347; color: #0f0f23; font-size: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
.nickname { font-size: 16px; color: #e2e8f0; }
.info-section { background: #1a1a3e; padding: 16px; }
.info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #2a2a5e; font-size: 14px; }
.info-label { color: #7c7caa; }
.info-value { color: #ffb347; }
</style>
